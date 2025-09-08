package detector

import (
	"fmt"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

// Version represents a semantic version
type Version struct {
	Major int
	Minor int
	Patch int
	Raw   string
}

// String returns the string representation of the version
func (v Version) String() string {
	return v.Raw
}

// Compare compares two versions. Returns -1 if v < other, 0 if v == other, 1 if v > other
func (v Version) Compare(other Version) int {
	if v.Major != other.Major {
		if v.Major < other.Major {
			return -1
		}
		return 1
	}
	if v.Minor != other.Minor {
		if v.Minor < other.Minor {
			return -1
		}
		return 1
	}
	if v.Patch != other.Patch {
		if v.Patch < other.Patch {
			return -1
		}
		return 1
	}
	return 0
}

// Detector handles version detection for Qoder releases
type Detector struct {
	baseURL    string
	httpClient *http.Client
	verbose    bool
}

// NewDetector creates a new version detector
func NewDetector(verbose bool) *Detector {
	return &Detector{
		baseURL: "https://download.qoder.com/release",
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		verbose: verbose,
	}
}

// ParseVersion parses a version string into a Version struct
func ParseVersion(versionStr string) (Version, error) {
	// Remove 'v' prefix if present
	versionStr = strings.TrimPrefix(versionStr, "v")
	
	// Match semantic version pattern
	re := regexp.MustCompile(`^(\d+)\.(\d+)\.(\d+)(?:-.*)?$`)
	matches := re.FindStringSubmatch(versionStr)
	if len(matches) < 4 {
		return Version{}, fmt.Errorf("invalid version format: %s", versionStr)
	}

	major, err := strconv.Atoi(matches[1])
	if err != nil {
		return Version{}, fmt.Errorf("invalid major version: %s", matches[1])
	}

	minor, err := strconv.Atoi(matches[2])
	if err != nil {
		return Version{}, fmt.Errorf("invalid minor version: %s", matches[2])
	}

	patch, err := strconv.Atoi(matches[3])
	if err != nil {
		return Version{}, fmt.Errorf("invalid patch version: %s", matches[3])
	}

	return Version{
		Major: major,
		Minor: minor,
		Patch: patch,
		Raw:   versionStr,
	}, nil
}

// CheckVersion checks if a specific version exists
func (d *Detector) CheckVersion(version string) (bool, error) {
	if d.verbose {
		fmt.Printf("Checking version: %s\n", version)
	}

	// For bruteforce, only check one platform to avoid unnecessary requests
	pattern := "Qoder-darwin-arm64.dmg"
	url := fmt.Sprintf("%s/%s/%s", d.baseURL, version, pattern)
	if d.verbose {
		fmt.Printf("  Checking URL: %s\n", url)
	}

	resp, err := d.httpClient.Head(url)
	if err != nil {
		if d.verbose {
			fmt.Printf("  Error: %v\n", err)
		}
		return false, err
	}
	resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		if d.verbose {
			fmt.Printf("  Found: %s (Status: %d)\n", pattern, resp.StatusCode)
		}
		return true, nil
	}

	if d.verbose {
		fmt.Printf("  Not found: %s (Status: %d)\n", pattern, resp.StatusCode)
	}

	return false, nil
}

// GenerateVersionCandidates generates a list of version candidates to check
func (d *Detector) GenerateVersionCandidates(maxMajor, maxMinor, maxPatch int) []string {
	var candidates []string

	// Generate semantic versions
	for major := 0; major <= maxMajor; major++ {
		for minor := 0; minor <= maxMinor; minor++ {
			for patch := 0; patch <= maxPatch; patch++ {
				candidates = append(candidates, fmt.Sprintf("%d.%d.%d", major, minor, patch))
			}
		}
	}

	return candidates
}

// SortVersions sorts a slice of versions in ascending order
func SortVersions(versions []Version) {
	sort.Slice(versions, func(i, j int) bool {
		return versions[i].Compare(versions[j]) < 0
	})
}