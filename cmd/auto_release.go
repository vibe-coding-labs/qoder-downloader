package cmd

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"sort"
	"strings"

	"github.com/google/go-github/v50/github"
	"github.com/spf13/cobra"
	"golang.org/x/oauth2"

	"github.com/vibe-coding-labs/qoder-downloader/internal/cache"
)

var autoReleaseCmd = &cobra.Command{
	Use:   "auto-release",
	Short: "Automatically create GitHub releases for newly detected versions",
	Long:  `Automatically create GitHub releases for versions that don't have releases yet.`,
	Run:   runAutoRelease,
}

var (
	githubToken string
	githubRepo  string
)

func init() {
	rootCmd.AddCommand(autoReleaseCmd)
	autoReleaseCmd.Flags().StringVar(&githubToken, "token", "", "GitHub personal access token")
	autoReleaseCmd.Flags().StringVar(&githubRepo, "repo", "vibe-coding-labs/qoder-downloader", "GitHub repository (owner/repo)")
}

func runAutoRelease(cmd *cobra.Command, args []string) {
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

	// Get all valid versions from cache
	validVersions := cacheManager.GetValidVersions()
	if len(validVersions) == 0 {
		log.Println("No valid versions found in cache")
		return
	}

	// Sort versions
	sort.Slice(validVersions, func(i, j int) bool {
		return validVersions[i].Compare(validVersions[j]) < 0
	})

	if verbose {
		fmt.Printf("Found %d valid versions in cache\n", len(validVersions))
	}

	// Get existing GitHub releases
	ctx := context.Background()
	client := createGitHubClient(ctx)

	existingReleases, err := getExistingReleases(ctx, client)
	if err != nil {
		log.Printf("Failed to get existing releases: %v", err)
		log.Println("Continuing without existing releases check...")
	}

	// Filter versions that don't have releases yet
	versionsToRelease := make([]string, 0)
	for _, version := range validVersions {
		versionStr := version.Raw
		tagName := "v" + versionStr

		// Check if release already exists
		exists := false
		for _, release := range existingReleases {
			if release.TagName != nil && *release.TagName == tagName {
				exists = true
				break
			}
		}

		if !exists {
			versionsToRelease = append(versionsToRelease, versionStr)
		}
	}

	if len(versionsToRelease) == 0 {
		fmt.Println("No new versions to create releases for")
		return
	}

	fmt.Printf("Creating releases for %d new versions: %v\n", len(versionsToRelease), versionsToRelease)

	// Create releases for each new version
	for _, version := range versionsToRelease {
		err := createReleaseForNewVersion(ctx, client, version)
		if err != nil {
			fmt.Printf("Failed to create release for %s: %v\n", version, err)
		} else {
			fmt.Printf("Successfully created release for %s\n", version)
		}
	}
}

func createGitHubClient(ctx context.Context) *github.Client {
	if githubToken != "" {
		ts := oauth2.StaticTokenSource(
			&oauth2.Token{AccessToken: githubToken},
		)
		tc := oauth2.NewClient(ctx, ts)
		return github.NewClient(tc)
	}
	return github.NewClient(nil) // Anonymous client
}

func getExistingReleases(ctx context.Context, client *github.Client) ([]*github.RepositoryRelease, error) {
	owner, repo, err := parseRepo(githubRepo)
	if err != nil {
		return nil, err
	}

	releases, _, err := client.Repositories.ListReleases(ctx, owner, repo, &github.ListOptions{
		PerPage: 100,
	})
	return releases, err
}

func parseRepo(repo string) (string, string, error) {
	parts := strings.Split(repo, "/")
	if len(parts) != 2 {
		return "", "", fmt.Errorf("invalid repo format, expected 'owner/repo'")
	}
	return parts[0], parts[1], nil
}

func createReleaseForNewVersion(ctx context.Context, client *github.Client, version string) error {
	tagName := "v" + version
	releaseName := fmt.Sprintf("Qoder %s", version)
	releaseBody := fmt.Sprintf("Automated release for Qoder version %s", version)

	// Execute the gh CLI command to create the release
	cmd := exec.Command("gh", "release", "create", tagName, 
		"--title", releaseName,
		"--notes", releaseBody,
		"--repo", githubRepo)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to create GitHub release with CLI: %v\nOutput: %s", err, string(output))
	}

	return nil
}