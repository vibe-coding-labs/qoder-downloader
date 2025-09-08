package cmd

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"

	"github.com/vibe-coding-labs/qoder-downloader/internal/cache"
)

var renameCmd = &cobra.Command{
	Use:   "rename",
	Short: "Rename downloaded Qoder files to include version and platform",
	Long:  `Rename downloaded Qoder files to the format qoder-{version}-{platform}.dmg`,
	Run:   runRename,
}

var (
	renameVersion string
	renameAll     bool
	renameDir     string
)

func init() {
	rootCmd.AddCommand(renameCmd)
	renameCmd.Flags().StringVar(&renameVersion, "version", "", "Specific version to rename files for")
	renameCmd.Flags().BoolVarP(&renameAll, "all", "a", false, "Rename files for all downloaded versions")
	renameCmd.Flags().StringVarP(&renameDir, "downloads", "d", "./downloads", "Downloads directory")
}

func runRename(cmd *cobra.Command, args []string) {
	verbose, _ := cmd.Flags().GetBool("verbose")
	
	// Initialize cache manager
	cacheManager, err := cache.NewManager(".", verbose, 24)
	if err != nil {
		log.Fatalf("Failed to create cache manager: %v", err)
	}
	
	err = cacheManager.Load()
	if err != nil {
		log.Fatalf("Failed to load cache: %v", err)
	}
	
	if renameAll {
		// Rename files for all versions
		existingVersions := cacheManager.GetExistingVersions()
		if len(existingVersions) == 0 {
			log.Fatal("No existing versions found in cache. Run 'download --all' first")
		}
		
		if verbose {
			fmt.Printf("Renaming files for %d versions...\n", len(existingVersions))
		}
		
		successCount := 0
		for _, version := range existingVersions {
			err := renameFilesForVersion(version, verbose)
			if err != nil {
				fmt.Printf("Failed to rename files for %s: %v\n", version, err)
			} else {
				successCount++
			}
		}
		
		fmt.Printf("Successfully renamed files for %d/%d versions\n", successCount, len(existingVersions))
	} else if renameVersion != "" {
		// Rename files for specific version
		err := renameFilesForVersion(renameVersion, verbose)
		if err != nil {
			log.Fatalf("Failed to rename files for %s: %v", renameVersion, err)
		}
		fmt.Printf("Successfully renamed files for version %s\n", renameVersion)
	} else {
		log.Fatal("Either --all or --version must be specified")
	}
}

func renameFilesForVersion(version string, verbose bool) error {
	versionDir := filepath.Join(renameDir, version)
	
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
	successCount := 0
	for _, file := range files {
		_, err := renameQoderFileActual(file, version, verbose)
		if err != nil {
			fmt.Printf("Failed to rename %s: %v\n", file, err)
			continue
		}
		successCount++
	}
	
	if successCount == 0 {
		return fmt.Errorf("no files were successfully renamed")
	}
	
	if verbose {
		fmt.Printf("Successfully renamed %d/%d files for version %s\n", successCount, len(files), version)
	}
	
	return nil
}

func renameQoderFileActual(originalPath, version string, verbose bool) (string, error) {
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