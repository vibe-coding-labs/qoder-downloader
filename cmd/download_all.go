package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/vibe-coding-labs/qoder-downloader/internal/cache"
	"github.com/vibe-coding-labs/qoder-downloader/internal/downloader"
	"github.com/vibe-coding-labs/qoder-downloader/internal/platform"
)

// downloadAllCmd represents the download-all command
var downloadAllCmd = &cobra.Command{
	Use:   "download-all",
	Short: "Download all versions for all platforms",
	Long: `Download all available versions of Qoder for all supported platforms.

This command will:
- Download all versions for all platforms (macOS, Windows, Linux)
- Support different file formats (dmg, exe, AppImage)
- Create organized directory structure by version
- Show detailed progress information

Examples:
  # Download all versions for all platforms
  qoder-downloader download-all
  
  # Download specific version for all platforms
  qoder-downloader download-all --version 0.1.21
  
  # Download all versions for specific platform
  qoder-downloader download-all --platform darwin-arm64
  
  # Download with verbose output
  qoder-downloader download-all --verbose
  
  # List available platforms
  qoder-downloader download-all --list-platforms`,
	Run: func(cmd *cobra.Command, args []string) {
		verbose, _ := cmd.Flags().GetBool("verbose")
		version, _ := cmd.Flags().GetString("version")
		platformName, _ := cmd.Flags().GetString("platform")
		listPlatforms, _ := cmd.Flags().GetBool("list-platforms")
		outputDir, _ := cmd.Flags().GetString("output")

		// Handle list platforms flag
		if listPlatforms {
			fmt.Println("Available platforms:")
			for _, p := range platform.GetAllPlatforms() {
				fmt.Printf("  %-15s (%s, %s)\n", p.Name, p.OS, p.Extension)
			}
			return
		}

		// Initialize cache manager (use current directory for cache files)
		cacheManager, err := cache.NewManager(".", verbose, 24)
		if err != nil {
			fmt.Printf("Failed to create cache manager: %v\n", err)
			os.Exit(1)
		}

		err = cacheManager.Load()
		if err != nil {
			fmt.Printf("Failed to load cache: %v\n", err)
			os.Exit(1)
		}

		// Initialize downloader
		downloaderInstance := downloader.NewDownloader(verbose, outputDir)

		// Determine what to download based on flags
		if version != "" && platformName != "" {
			// Download specific version for specific platform
			if verbose {
				fmt.Printf("Downloading version %s for platform %s\n", version, platformName)
			}
			err = downloaderInstance.DownloadVersion(version, platformName)
		} else if version != "" {
			// Download specific version for all platforms
			if verbose {
				fmt.Printf("Downloading version %s for all platforms\n", version)
			}
			err = downloaderInstance.DownloadAllPlatforms(version)
		} else if platformName != "" {
			// Download all versions for specific platform
			versions := cacheManager.GetExistingVersions()
			if len(versions) == 0 {
				fmt.Println("No versions found. Please run 'qoder-downloader list' first to discover versions.")
				os.Exit(1)
			}
			if verbose {
				fmt.Printf("Downloading all %d versions for platform %s\n", len(versions), platformName)
			}
			err = downloaderInstance.DownloadAllVersions(versions, platformName)
		} else {
			// Download all versions for all platforms
			versions := cacheManager.GetExistingVersions()
			if len(versions) == 0 {
				fmt.Println("No versions found. Please run 'qoder-downloader list' first to discover versions.")
				os.Exit(1)
			}
			if verbose {
				fmt.Printf("Downloading all %d versions for all platforms\n", len(versions))
			}
			err = downloaderInstance.DownloadAllVersionsAllPlatforms(versions)
		}

		if err != nil {
			fmt.Printf("Download failed: %v\n", err)
			os.Exit(1)
		}

		if verbose {
			fmt.Println("\nAll downloads completed successfully!")
		}
	},
}

func init() {
	rootCmd.AddCommand(downloadAllCmd)

	// Add flags
	downloadAllCmd.Flags().StringP("version", "v", "", "Download specific version (if not specified, downloads all versions)")
	downloadAllCmd.Flags().StringP("platform", "p", "", "Download for specific platform (if not specified, downloads all platforms)")
	downloadAllCmd.Flags().BoolP("list-platforms", "l", false, "List all available platforms")
	downloadAllCmd.Flags().StringP("output", "o", "downloads", "Output directory for downloads")
	downloadAllCmd.Flags().BoolP("verbose", "", false, "Enable verbose output")
}