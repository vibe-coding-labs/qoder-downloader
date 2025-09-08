package cmd

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"

	"github.com/vibe-coding-labs/qoder-downloader/internal/cache"
)

var releaseCmd = &cobra.Command{
	Use:   "release",
	Short: "Create GitHub releases with renamed Qoder files",
	Long:  `Create GitHub releases for each version and upload renamed Qoder files as assets.`,
	Run:   runRelease,
}

var (
	releaseVersion string
	releaseAll     bool
	downloadsDir   string
	dryRun         bool
)

func init() {
	rootCmd.AddCommand(releaseCmd)
	releaseCmd.Flags().StringVar(&releaseVersion, "version", "", "Specific version to create release for")
	releaseCmd.Flags().BoolVarP(&releaseAll, "all", "a", false, "Create releases for all downloaded versions")
	releaseCmd.Flags().StringVarP(&downloadsDir, "downloads", "d", "./downloads", "Downloads directory")
	releaseCmd.Flags().BoolVar(&dryRun, "dry-run", false, "Show what would be done without actually doing it")
}

func runRelease(cmd *cobra.Command, args []string) {
	verbose, _ := cmd.Flags().GetBool("verbose")
	
	// Check if GitHub CLI is installed (skip in dry-run mode)
	if !dryRun && !isGitHubCLIInstalled() {
		log.Fatal("GitHub CLI (gh) is not installed. Please install it first: https://cli.github.com/")
	}
	
	// Initialize cache manager
	cacheManager, err := cache.NewManager(".", verbose, 24)
	if err != nil {
		log.Fatalf("Failed to create cache manager: %v", err)
	}
	
	err = cacheManager.Load()
	if err != nil {
		log.Fatalf("Failed to load cache: %v", err)
	}
	
	if releaseAll {
		// Create releases for all versions
		existingVersions := cacheManager.GetExistingVersions()
		if len(existingVersions) == 0 {
			log.Fatal("No existing versions found in cache. Run 'download --all' first")
		}
		
		if verbose {
			fmt.Printf("Creating releases for %d versions...\n", len(existingVersions))
		}
		
		for _, version := range existingVersions {
			err := createReleaseForVersion(version, verbose, dryRun)
			if err != nil {
				fmt.Printf("Failed to create release for %s: %v\n", version, err)
			}
		}
	} else if releaseVersion != "" {
		// Create release for specific version
		err := createReleaseForVersion(releaseVersion, verbose, dryRun)
		if err != nil {
			log.Fatalf("Failed to create release for %s: %v", releaseVersion, err)
		}
	} else {
		log.Fatal("Either --all or --version must be specified")
	}
}

func isGitHubCLIInstalled() bool {
	_, err := exec.LookPath("gh")
	return err == nil
}

func createReleaseForVersion(version string, verbose bool, dryRun bool) error {
	versionDir := filepath.Join(downloadsDir, version)
	
	// Check if version directory exists
	if _, err := os.Stat(versionDir); os.IsNotExist(err) {
		return fmt.Errorf("version directory %s does not exist. Run 'download --version %s' first", versionDir, version)
	}
	
	if verbose {
		fmt.Printf("Processing version %s...\n", version)
	}
	
	// Find all DMG files in the version directory
	files, err := filepath.Glob(filepath.Join(versionDir, "*.dmg"))
	if err != nil {
		return fmt.Errorf("failed to find DMG files: %v", err)
	}
	
	if len(files) == 0 {
		return fmt.Errorf("no DMG files found in %s", versionDir)
	}
	
	// Rename files to the new format
	renamedFiles := make([]string, 0, len(files))
	for _, file := range files {
		renamedFile, err := renameQoderFile(file, version, verbose, dryRun)
		if err != nil {
			fmt.Printf("Failed to rename %s: %v\n", file, err)
			continue
		}
		renamedFiles = append(renamedFiles, renamedFile)
	}
	
	if len(renamedFiles) == 0 {
		return fmt.Errorf("no files were successfully renamed")
	}
	
	// Create GitHub release
	if dryRun {
		fmt.Printf("[DRY RUN] Would create GitHub release for version %s\n", version)
		fmt.Printf("[DRY RUN] Would upload files: %v\n", renamedFiles)
		return nil
	}
	
	return createGitHubRelease(version, renamedFiles, verbose)
}

func renameQoderFile(originalPath, version string, verbose bool, dryRun bool) (string, error) {
	filename := filepath.Base(originalPath)
	dir := filepath.Dir(originalPath)
	
	// Extract platform from original filename
	// Expected format: Qoder-darwin-arm64.dmg -> qoder-0.1.21-darwin-arm64.dmg
	if !strings.HasPrefix(filename, "Qoder-") || !strings.HasSuffix(filename, ".dmg") {
		return "", fmt.Errorf("unexpected filename format: %s", filename)
	}
	
	// Extract platform part (e.g., "darwin-arm64" from "Qoder-darwin-arm64.dmg")
	platform := strings.TrimSuffix(strings.TrimPrefix(filename, "Qoder-"), ".dmg")
	
	// Create new filename
	newFilename := fmt.Sprintf("qoder-%s-%s.dmg", version, platform)
	newPath := filepath.Join(dir, newFilename)
	
	if verbose {
		fmt.Printf("Renaming %s -> %s\n", filename, newFilename)
	}
	
	if dryRun {
		fmt.Printf("[DRY RUN] Would rename: %s -> %s\n", originalPath, newPath)
		return newPath, nil
	}
	
	// Check if target file already exists
	if _, err := os.Stat(newPath); err == nil {
		if verbose {
			fmt.Printf("File %s already exists, skipping rename\n", newPath)
		}
		return newPath, nil
	}
	
	err := os.Rename(originalPath, newPath)
	if err != nil {
		return "", fmt.Errorf("failed to rename file: %v", err)
	}
	
	return newPath, nil
}

func createGitHubRelease(version string, files []string, verbose bool) error {
	if verbose {
		fmt.Printf("Creating GitHub release for version %s...\n", version)
	}
	
	// Create the release
	cmd := exec.Command("gh", "release", "create", version, 
		"--title", fmt.Sprintf("Qoder %s", version),
		"--notes", fmt.Sprintf("Release of Qoder version %s", version))
	
	// Add all files as assets
	for _, file := range files {
		cmd.Args = append(cmd.Args, file)
	}
	
	if verbose {
		fmt.Printf("Running: %s\n", strings.Join(cmd.Args, " "))
	}
	
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to create GitHub release: %v\nOutput: %s", err, string(output))
	}
	
	if verbose {
		fmt.Printf("Successfully created release for version %s\n", version)
		fmt.Printf("GitHub CLI output: %s\n", string(output))
	}
	
	return nil
}