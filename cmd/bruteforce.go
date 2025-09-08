package cmd

import (
	"fmt"
	"log"

	"github.com/spf13/cobra"
	"github.com/vibe-coding-labs/qoder-downloader/internal/cache"
	"github.com/vibe-coding-labs/qoder-downloader/internal/detector"
)

var bruteforceCmd = &cobra.Command{
	Use:   "bruteforce",
	Short: "Bruteforce versions starting from a given version",
	Long:  `Bruteforce versions by decrementing from a starting version to find all available versions.`,
	Run:   runBruteforce,
}

var (
	startVersion string
	maxVersions  int
)

func init() {
	rootCmd.AddCommand(bruteforceCmd)
	bruteforceCmd.Flags().StringVar(&startVersion, "start", "0.1.21", "Starting version to bruteforce from")
	bruteforceCmd.Flags().IntVar(&maxVersions, "max", 100, "Maximum number of versions to check")
}

func runBruteforce(cmd *cobra.Command, args []string) {
	verbose, _ := cmd.Flags().GetBool("verbose")
	if verbose {
		log.Printf("Starting bruteforce from version %s\n", startVersion)
	}

	// Initialize detector and cache
	det := detector.NewDetector(verbose)
	cacheManager, err := cache.NewManager(".", true, 1000)
	if err != nil {
		log.Fatalf("Failed to create cache manager: %v", err)
	}

	// Parse starting version
	startVer, err := detector.ParseVersion(startVersion)
	if err != nil {
		log.Fatalf("Invalid start version: %v", err)
	}

	checkedCount := 0
	foundVersions := []string{}

	// Start from the given version and work backwards
	currentMajor := startVer.Major
	currentMinor := startVer.Minor
	currentPatch := startVer.Patch

	for checkedCount < maxVersions {
		versionStr := fmt.Sprintf("%d.%d.%d", currentMajor, currentMinor, currentPatch)
		
		if verbose {
			fmt.Printf("Checking version %s...\n", versionStr)
		}

		// Check if version exists
		exists, err := det.CheckVersion(versionStr)
		if err != nil {
			log.Printf("Error checking version %s: %v\n", versionStr, err)
			continue
		}
		cached := cacheManager.IsRequested(versionStr)
		
		if exists {
			foundVersions = append(foundVersions, versionStr)
			cacheManager.AddExisting(versionStr)
			if verbose {
				if cached {
					fmt.Printf("Version %s: EXISTS (cached)\n", versionStr)
				} else {
					fmt.Printf("Version %s: EXISTS\n", versionStr)
				}
			}
		} else {
			cacheManager.AddRequested(versionStr)
			if verbose {
				if cached {
					fmt.Printf("Version %s: NOT FOUND (cached)\n", versionStr)
				} else {
					fmt.Printf("Version %s: NOT FOUND\n", versionStr)
				}
			}
		}

		checkedCount++

		// Decrement version
		if currentPatch > 0 {
			currentPatch--
		} else if currentMinor > 0 {
			currentMinor--
			currentPatch = 100 // Reset to high patch number (0-100)
		} else if currentMajor > 0 {
			currentMajor--
			currentMinor = 99 // Reset to high minor number
			currentPatch = 100 // Reset to high patch number (0-100)
		} else {
			// Reached 0.0.0, stop
			break
		}
	}

	// Print summary
	fmt.Printf("\n=== Bruteforce Summary ===\n")
	fmt.Printf("Checked %d versions\n", checkedCount)
	fmt.Printf("Found %d existing versions:\n", len(foundVersions))
	for _, v := range foundVersions {
		fmt.Printf("  - %s\n", v)
	}
}