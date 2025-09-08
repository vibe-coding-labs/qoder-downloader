package cmd

import (
	"fmt"
	"log"
	"runtime"

	"github.com/spf13/cobra"
	"github.com/vibe-coding-labs/qoder-downloader/internal/cache"
	"github.com/vibe-coding-labs/qoder-downloader/internal/downloader"
)

var downloadCmd = &cobra.Command{
	Use:   "download",
	Short: "Download Qoder versions",
	Long:  `Download Qoder versions for specified platforms. If no platform is specified, downloads for current platform.`,
	Run:   runDownload,
}

var (
	downloadVersion  string
	downloadPlatform string
	downloadAll      bool
	outputDir        string
)

func init() {
	rootCmd.AddCommand(downloadCmd)
	downloadCmd.Flags().StringVar(&downloadVersion, "version", "", "Specific version to download (e.g., 0.1.21)")
	downloadCmd.Flags().StringVarP(&downloadPlatform, "platform", "p", "", "Platform to download (darwin-arm64, darwin-x64, linux-x64, windows-x64)")
	downloadCmd.Flags().BoolVarP(&downloadAll, "all", "a", false, "Download all existing versions")
	downloadCmd.Flags().StringVarP(&outputDir, "output", "o", "./downloads", "Output directory for downloads")
}

func runDownload(cmd *cobra.Command, args []string) {
	verbose, _ := cmd.Flags().GetBool("verbose")
	
	// Initialize cache manager
	cacheManager, err := cache.NewManager(".", verbose, 24)
	if err != nil {
		log.Fatalf("Failed to create cache manager: %v", err)
	}
	
	// Initialize downloader
	dl := downloader.NewDownloader(verbose, outputDir)
	
	// Determine platform
	platform := downloadPlatform
	if platform == "" {
		platform = getCurrentPlatform()
		if verbose {
			fmt.Printf("Auto-detected platform: %s\n", platform)
		}
	}
	
	// Load cache
	err = cacheManager.Load()
	if err != nil {
		log.Fatalf("Failed to load cache: %v", err)
	}

	if downloadAll {
		// Download all existing versions
		existingVersions := cacheManager.GetExistingVersions()
		
		if len(existingVersions) == 0 {
			fmt.Println("No existing versions found. Run 'bruteforce' command first to discover versions.")
			return
		}
		
		fmt.Printf("Downloading %d versions for platform %s...\n", len(existingVersions), platform)
		
		err = dl.DownloadAllVersions(existingVersions, platform)
		if err != nil {
			log.Fatalf("Failed to download versions: %v", err)
		}
	} else if downloadVersion != "" {
		// Download specific version
		fmt.Printf("Downloading version %s for platform %s...\n", downloadVersion, platform)
		
		err := dl.DownloadVersion(downloadVersion, platform)
		if err != nil {
			log.Fatalf("Failed to download %s: %v", downloadVersion, err)
		} else {
			fmt.Printf("Successfully downloaded %s\n", downloadVersion)
		}
	} else {
		fmt.Println("Please specify either --version or --all flag")
		cmd.Help()
	}
}

func getCurrentPlatform() string {
	goos := runtime.GOOS
	goarch := runtime.GOARCH
	
	switch goos {
	case "darwin":
		if goarch == "arm64" {
			return "darwin-arm64"
		}
		return "darwin-x64"
	case "linux":
		return "linux-x64"
	case "windows":
		return "windows-x64"
	default:
		return "darwin-arm64" // fallback
	}
}