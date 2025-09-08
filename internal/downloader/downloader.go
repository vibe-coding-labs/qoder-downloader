package downloader

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"
	
	"github.com/vibe-coding-labs/qoder-downloader/internal/platform"
)

type Downloader struct {
	verbose   bool
	outputDir string
	client    *http.Client
}

type ProgressReader struct {
	Reader   io.Reader
	Total    int64
	Current  int64
	Filename string
	Verbose  bool
	lastPrint time.Time
}

func (pr *ProgressReader) Read(p []byte) (int, error) {
	n, err := pr.Reader.Read(p)
	pr.Current += int64(n)
	
	// Print progress every 500ms to avoid too frequent updates
	if pr.Verbose && time.Since(pr.lastPrint) > 500*time.Millisecond {
		percent := float64(pr.Current) / float64(pr.Total) * 100
		fmt.Printf("\rProgress: %.1f%% (%.2f/%.2f MB)", 
			percent, 
			float64(pr.Current)/1024/1024, 
			float64(pr.Total)/1024/1024)
		pr.lastPrint = time.Now()
	}
	
	return n, err
}

func NewDownloader(verbose bool, outputDir string) *Downloader {
	return &Downloader{
		verbose:   verbose,
		outputDir: outputDir,
		client: &http.Client{
			Timeout: 30 * time.Minute, // Long timeout for large files
		},
	}
}

func (d *Downloader) DownloadVersion(version, platformName string) error {
	// Get platform info
	platformInfo, err := platform.GetPlatformByName(platformName)
	if err != nil {
		return fmt.Errorf("invalid platform %s: %v", platformName, err)
	}

	// Create output directory if it doesn't exist
	versionDir := filepath.Join(d.outputDir, version)
	err = os.MkdirAll(versionDir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create directory %s: %v", versionDir, err)
	}

	// Construct download URL and filename with version
	var filename string
	if platformInfo.OS == "windows" {
		// Special naming for Windows platforms to include OS name
		if platformInfo.Arch == "amd64" {
			filename = fmt.Sprintf("qoder-%s-windows-x64.exe", version)
		} else if platformInfo.Arch == "arm64" {
			filename = fmt.Sprintf("qoder-%s-windows-arm64.exe", version)
		}
	} else {
		// Default naming for other platforms
		filename = fmt.Sprintf("qoder-%s-%s.%s", version, platformInfo.Name, platformInfo.Extension)
	}
	url := platform.ConstructDownloadURL(version, platformInfo)
	outputPath := filepath.Join(versionDir, filename)

	// Check if file already exists
	if _, err := os.Stat(outputPath); err == nil {
		if d.verbose {
			fmt.Printf("File already exists: %s\n", outputPath)
		}
		return nil
	}

	if d.verbose {
		fmt.Printf("Downloading: %s\n", url)
		fmt.Printf("Output: %s\n", outputPath)
	}

	// Create HTTP request
	resp, err := d.client.Get(url)
	if err != nil {
		return fmt.Errorf("failed to download %s: %v", url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to download %s: HTTP %d", url, resp.StatusCode)
	}

	// Create output file
	outFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create file %s: %v", outputPath, err)
	}
	defer outFile.Close()

	// Get file size for progress tracking
	contentLength := resp.Header.Get("Content-Length")
	var totalSize int64
	if contentLength != "" {
		totalSize, _ = strconv.ParseInt(contentLength, 10, 64)
	}

	// Copy data with progress tracking
	if d.verbose {
		if totalSize > 0 {
			fmt.Printf("Downloading %s (%.2f MB)...\n", filename, float64(totalSize)/1024/1024)
		} else {
			fmt.Printf("Downloading %s...\n", filename)
		}
	}

	var written int64
	if d.verbose && totalSize > 0 {
		// Use progress reader for verbose mode
		progressReader := &ProgressReader{
			Reader:    resp.Body,
			Total:     totalSize,
			Filename:  filename,
			Verbose:   d.verbose,
		}
		written, err = io.Copy(outFile, progressReader)
	} else {
		written, err = io.Copy(outFile, resp.Body)
	}

	if err != nil {
		return fmt.Errorf("failed to write file %s: %v", outputPath, err)
	}

	if d.verbose {
		fmt.Printf("\nDownload completed: %s (%.2f MB)\n", outputPath, float64(written)/1024/1024)
	}

	return nil
}

// DownloadAllVersions downloads all existing versions for the specified platform
func (d *Downloader) DownloadAllVersions(versions []string, platformName string) error {
	if len(versions) == 0 {
		return fmt.Errorf("no versions to download")
	}

	if d.verbose {
		fmt.Printf("Starting batch download of %d versions for platform %s\n", len(versions), platformName)
	}

	successCount := 0
	failCount := 0

	for i, version := range versions {
		if d.verbose {
			fmt.Printf("\n[%d/%d] ", i+1, len(versions))
		}

		err := d.DownloadVersion(version, platformName)
		if err != nil {
			fmt.Printf("Failed to download %s for %s: %v\n", version, platformName, err)
			failCount++
		} else {
			successCount++
		}
	}

	if d.verbose {
		fmt.Printf("\n\nBatch download completed:\n")
		fmt.Printf("  Success: %d\n", successCount)
		fmt.Printf("  Failed: %d\n", failCount)
		fmt.Printf("  Total: %d\n", len(versions))
	}

	if failCount > 0 {
		return fmt.Errorf("%d downloads failed out of %d total", failCount, len(versions))
	}

	return nil
}

// DownloadAllPlatforms downloads a specific version for all platforms
func (d *Downloader) DownloadAllPlatforms(version string) error {
	platforms := platform.GetAllPlatforms()
	
	if d.verbose {
		fmt.Printf("Starting download of version %s for all %d platforms\n", version, len(platforms))
	}

	successCount := 0
	failCount := 0

	for i, platformInfo := range platforms {
		if d.verbose {
			fmt.Printf("\n[%d/%d] ", i+1, len(platforms))
		}

		err := d.DownloadVersion(version, platformInfo.Name)
		if err != nil {
			fmt.Printf("Failed to download %s for %s: %v\n", version, platformInfo.Name, err)
			failCount++
		} else {
			successCount++
		}
	}

	if d.verbose {
		fmt.Printf("\n\nAll platforms download completed:\n")
		fmt.Printf("  Success: %d\n", successCount)
		fmt.Printf("  Failed: %d\n", failCount)
		fmt.Printf("  Total: %d\n", len(platforms))
	}

	if failCount > 0 {
		return fmt.Errorf("%d downloads failed out of %d total", failCount, len(platforms))
	}

	return nil
}

// DownloadAllVersionsAllPlatforms downloads all versions for all platforms
func (d *Downloader) DownloadAllVersionsAllPlatforms(versions []string) error {
	if len(versions) == 0 {
		return fmt.Errorf("no versions to download")
	}

	platforms := platform.GetAllPlatforms()
	totalDownloads := len(versions) * len(platforms)
	
	if d.verbose {
		fmt.Printf("Starting massive download: %d versions × %d platforms = %d total downloads\n", 
			len(versions), len(platforms), totalDownloads)
	}

	successCount := 0
	failCount := 0
	currentDownload := 0

	for _, version := range versions {
		for _, platformInfo := range platforms {
			currentDownload++
			if d.verbose {
				fmt.Printf("\n[%d/%d] ", currentDownload, totalDownloads)
			}

			err := d.DownloadVersion(version, platformInfo.Name)
			if err != nil {
				fmt.Printf("Failed to download %s for %s: %v\n", version, platformInfo.Name, err)
				failCount++
			} else {
				successCount++
			}
		}
	}

	if d.verbose {
		fmt.Printf("\n\nMassive download completed:\n")
		fmt.Printf("  Success: %d\n", successCount)
		fmt.Printf("  Failed: %d\n", failCount)
		fmt.Printf("  Total: %d\n", totalDownloads)
	}

	if failCount > 0 {
		return fmt.Errorf("%d downloads failed out of %d total", failCount, totalDownloads)
	}

	return nil
}