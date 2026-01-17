package cmd

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"github.com/vibe-coding-labs/qoder-downloader/internal/cache"
	"github.com/vibe-coding-labs/qoder-downloader/internal/detector"
)

// detectCmd represents the detect command
var detectCmd = &cobra.Command{
	Use:   "detect",
	Short: "Detect available Qoder versions",
	Long: `Detect available Qoder versions by checking the download URLs.
This command will probe different version numbers and cache the results
locally to avoid repeated detection.`,
	Run: runDetect,
}

var (
	maxMajor    int
	maxMinor    int
	maxPatch    int
	showCached  bool
	clearCache  bool
	showStats   bool
	cacheTTL    int64
	specificVer string
)

func init() {
	rootCmd.AddCommand(detectCmd)

	// Detection range flags
	detectCmd.Flags().IntVar(&maxMajor, "max-major", 3, "Maximum major version to check")
	detectCmd.Flags().IntVar(&maxMinor, "max-minor", 20, "Maximum minor version to check")
	detectCmd.Flags().IntVar(&maxPatch, "max-patch", 50, "Maximum patch version to check")

	// Cache management flags
	detectCmd.Flags().BoolVar(&showCached, "show-cached", false, "Show cached versions without detection")
	detectCmd.Flags().BoolVar(&clearCache, "clear-cache", false, "Clear the version cache")
	detectCmd.Flags().BoolVar(&showStats, "stats", false, "Show cache statistics")
	detectCmd.Flags().Int64Var(&cacheTTL, "cache-ttl", 24, "Cache TTL in hours (0 = never expire)")

	// Specific version check
	detectCmd.Flags().StringVar(&specificVer, "version", "", "Check a specific version (e.g., 0.1.0)")
}

func runDetect(cmd *cobra.Command, args []string) {
	verbose := viper.GetBool("verbose")
	cacheDir := viper.GetString("cache-dir")

	// Initialize cache manager
	cacheManager, err := cache.NewManager(cacheDir, verbose, cacheTTL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error initializing cache: %v\n", err)
		os.Exit(1)
	}

	// Handle cache operations
	if clearCache {
		if err := cacheManager.Clear(); err != nil {
			fmt.Fprintf(os.Stderr, "Error clearing cache: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("Cache cleared successfully")
		return
	}

	if showStats {
		requested, existing := cacheManager.Stats()
		fmt.Printf("Cache Statistics:\n")
		fmt.Printf("  Requested versions: %d\n", requested)
		fmt.Printf("  Existing versions: %d\n", existing)
		return
	}

	if showCached {
		versions := cacheManager.GetValidVersions()
		if len(versions) == 0 {
			fmt.Println("No cached versions found")
			return
		}

		fmt.Printf("Cached valid versions (%d):\n", len(versions))
		for _, version := range versions {
			fmt.Printf("  %s\n", version.String())
		}
		return
	}

	// Initialize detector
	det := detector.NewDetector(verbose)

	// Check specific version if provided
	if specificVer != "" {
		if err := checkSpecificVersion(det, cacheManager, specificVer); err != nil {
			fmt.Fprintf(os.Stderr, "Error checking version %s: %v\n", specificVer, err)
			os.Exit(1)
		}
		return
	}

	// Run full detection
	if err := runFullDetection(det, cacheManager); err != nil {
		fmt.Fprintf(os.Stderr, "Error during detection: %v\n", err)
		os.Exit(1)
	}
}

func checkSpecificVersion(det *detector.Detector, cacheManager *cache.Manager, version string) error {
	// Check cache first
	if requested, exists := cacheManager.Get(version); requested {
		if exists {
			fmt.Printf("Version %s: EXISTS (cached)\n", version)
		} else {
			fmt.Printf("Version %s: NOT FOUND (cached)\n", version)
		}
		return nil
	}

	// Check online
	fmt.Printf("Checking version %s...\n", version)
	exists, err := det.CheckVersion(version)
	if err != nil {
		return err
	}

	// Cache the result
	cacheManager.Set(version, exists)
	if err := cacheManager.Save(); err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Failed to save cache: %v\n", err)
	}

	if exists {
		fmt.Printf("Version %s: EXISTS\n", version)
	} else {
		fmt.Printf("Version %s: NOT FOUND\n", version)
	}

	return nil
}

func runFullDetection(det *detector.Detector, cacheManager *cache.Manager) error {
	fmt.Printf("Starting version detection (max: %d.%d.%d)...\n", maxMajor, maxMinor, maxPatch)
	start := time.Now()

	// Generate version candidates
	candidates := det.GenerateVersionCandidates(maxMajor, maxMinor, maxPatch)
	fmt.Printf("Generated %d version candidates\n", len(candidates))

	var foundVersions []detector.Version
	checked := 0
	skipped := 0

	for i, candidate := range candidates {
		// Show progress
		if i%50 == 0 || i == len(candidates)-1 {
			fmt.Printf("Progress: %d/%d (%.1f%%)\r", i+1, len(candidates), float64(i+1)/float64(len(candidates))*100)
		}

		// Check cache first
		if requested, exists := cacheManager.Get(candidate); requested {
			skipped++
			if exists {
				if version, err := detector.ParseVersion(candidate); err == nil {
					foundVersions = append(foundVersions, version)
				}
			}
			continue
		}

		// Check online
		exists, err := det.CheckVersion(candidate)
		if err != nil {
			fmt.Fprintf(os.Stderr, "\nError checking %s: %v\n", candidate, err)
			continue
		}

		checked++
		cacheManager.Set(candidate, exists)

		if exists {
			if version, err := detector.ParseVersion(candidate); err == nil {
				foundVersions = append(foundVersions, version)
				if viper.GetBool("verbose") {
					fmt.Printf("\nFound version: %s\n", candidate)
				}
			}
		}

		// Save cache periodically
		if checked%10 == 0 {
			if err := cacheManager.Save(); err != nil {
				fmt.Fprintf(os.Stderr, "\nWarning: Failed to save cache: %v\n", err)
			}
		}
	}

	fmt.Printf("\n\n")

	// Save final cache
	if err := cacheManager.Save(); err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Failed to save cache: %v\n", err)
	}

	// Sort and display results
	detector.SortVersions(foundVersions)

	duration := time.Since(start)
	fmt.Printf("Detection completed in %v\n", duration)
	fmt.Printf("Checked: %d versions, Skipped (cached): %d versions\n", checked, skipped)
	fmt.Printf("Found %d available versions:\n\n", len(foundVersions))

	if len(foundVersions) == 0 {
		fmt.Println("No versions found.")
		return nil
	}

	// Display versions in a nice format
	for i, version := range foundVersions {
		fmt.Printf("  %2d. %s\n", i+1, version.String())
	}

	fmt.Printf("\nLatest version: %s\n", foundVersions[len(foundVersions)-1].String())

	// Show download URL for latest version
	latestVersion := foundVersions[len(foundVersions)-1].String()
	fmt.Printf("\nDownload URLs for %s:\n", latestVersion)
	patterns := []string{
		"Qoder-darwin-arm64.dmg",
		"Qoder-darwin-x64.dmg",
		"Qoder-linux-x64.tar.gz",
		"Qoder-win32-x64.zip",
	}

	for _, pattern := range patterns {
		url := fmt.Sprintf("https://download.qoder.com/release/%s/%s", latestVersion, pattern)
		fmt.Printf("  %s\n", url)
	}

	return nil
}