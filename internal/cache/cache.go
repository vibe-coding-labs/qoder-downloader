package cache

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/vibe-coding-labs/qoder-downloader/internal/detector"
)

// Manager handles cache operations
type Manager struct {
	cacheDir      string
	requestedFile string
	existingFile  string
	verbose       bool
	ttl           int64 // Default TTL in hours (currently unused for text format)
}

// NewManager creates a new cache manager
func NewManager(cacheDir string, verbose bool, ttl int64) (*Manager, error) {
	if cacheDir == "" {
		// Use current working directory instead of home directory
		cwd, err := os.Getwd()
		if err != nil {
			return nil, fmt.Errorf("failed to get current directory: %w", err)
		}
		cacheDir = cwd
	}

	requestedFile := filepath.Join(cacheDir, "requested_versions.txt")
	existingFile := filepath.Join(cacheDir, "existing_versions.txt")

	m := &Manager{
		cacheDir:      cacheDir,
		requestedFile: requestedFile,
		existingFile:  existingFile,
		verbose:       verbose,
		ttl:           ttl,
	}

	return m, nil
}

// Load loads cache data from files
func (m *Manager) Load() error {
	// Create cache directory if it doesn't exist
	if err := os.MkdirAll(m.cacheDir, 0755); err != nil {
		return fmt.Errorf("failed to create cache directory: %w", err)
	}

	// Files will be created automatically when needed
	return nil
}

// Save saves cache data to files (no-op for text format as we write immediately)
func (m *Manager) Save() error {
	return nil
}

// readVersionsFromFile reads versions from a text file
func (m *Manager) readVersionsFromFile(filename string) (map[string]bool, error) {
	versions := make(map[string]bool)
	
	file, err := os.Open(filename)
	if err != nil {
		if os.IsNotExist(err) {
			return versions, nil // Return empty map if file doesn't exist
		}
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		version := strings.TrimSpace(scanner.Text())
		if version != "" {
			versions[version] = true
		}
	}

	return versions, scanner.Err()
}

// appendVersionToFile appends a version to a text file
func (m *Manager) appendVersionToFile(filename, version string) error {
	file, err := os.OpenFile(filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = fmt.Fprintln(file, version)
	return err
}

// IsRequested checks if a version has been requested
func (m *Manager) IsRequested(version string) bool {
	versions, err := m.readVersionsFromFile(m.requestedFile)
	if err != nil {
		return false
	}
	return versions[version]
}

// IsExisting checks if a version exists
func (m *Manager) IsExisting(version string) bool {
	versions, err := m.readVersionsFromFile(m.existingFile)
	if err != nil {
		return false
	}
	return versions[version]
}

// AddRequested adds a version to the requested list
func (m *Manager) AddRequested(version string) {
	if !m.IsRequested(version) {
		m.appendVersionToFile(m.requestedFile, version)
	}
}

// AddExisting adds a version to the existing list
func (m *Manager) AddExisting(version string) {
	if !m.IsExisting(version) {
		m.appendVersionToFile(m.existingFile, version)
	}
}

// Get returns whether a version has been requested and whether it exists
func (m *Manager) Get(version string) (bool, bool) {
	return m.IsRequested(version), m.IsExisting(version)
}

// Set records a version request and its existence status
func (m *Manager) Set(version string, exists bool) {
	m.AddRequested(version)
	if exists {
		m.AddExisting(version)
	}
}

// GetValidVersions returns all existing versions as detector.Version objects
func (m *Manager) GetValidVersions() []detector.Version {
	versions, err := m.readVersionsFromFile(m.existingFile)
	if err != nil {
		return nil
	}

	var result []detector.Version
	for version := range versions {
		if v, err := detector.ParseVersion(version); err == nil {
			result = append(result, v)
		}
	}
	return result
}

// GetRequestedVersions returns all requested versions
func (m *Manager) GetRequestedVersions() []string {
	versions, err := m.readVersionsFromFile(m.requestedFile)
	if err != nil {
		return nil
	}

	var result []string
	for version := range versions {
		result = append(result, version)
	}
	return result
}

// GetExistingVersions returns all existing versions
func (m *Manager) GetExistingVersions() []string {
	versions, err := m.readVersionsFromFile(m.existingFile)
	if err != nil {
		return nil
	}

	var result []string
	for version := range versions {
		result = append(result, version)
	}
	return result
}

// Clear removes all cache files
func (m *Manager) Clear() error {
	var errors []string

	if err := os.Remove(m.requestedFile); err != nil && !os.IsNotExist(err) {
		errors = append(errors, fmt.Sprintf("failed to remove %s: %v", m.requestedFile, err))
	}

	if err := os.Remove(m.existingFile); err != nil && !os.IsNotExist(err) {
		errors = append(errors, fmt.Sprintf("failed to remove %s: %v", m.existingFile, err))
	}

	if len(errors) > 0 {
		return fmt.Errorf("cache clear errors: %s", strings.Join(errors, "; "))
	}

	return nil
}

// Stats returns the number of requested and existing versions
func (m *Manager) Stats() (requested, existing int) {
	requestedVersions, _ := m.readVersionsFromFile(m.requestedFile)
	existingVersions, _ := m.readVersionsFromFile(m.existingFile)
	return len(requestedVersions), len(existingVersions)
}