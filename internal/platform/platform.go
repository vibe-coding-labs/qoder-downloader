package platform

import (
	"fmt"
	"runtime"
)

// PlatformInfo represents information about a platform
type PlatformInfo struct {
	Name      string // Platform name used in URLs
	Extension string // File extension
	OS        string // Operating system
	Arch      string // Architecture
}

// GetAllPlatforms returns all supported platforms
func GetAllPlatforms() []PlatformInfo {
	return []PlatformInfo{
		// macOS platforms
		{Name: "darwin-arm64", Extension: "dmg", OS: "darwin", Arch: "arm64"},
		{Name: "darwin-x64", Extension: "dmg", OS: "darwin", Arch: "amd64"},
		
		// Windows platforms
		{Name: "win32-x64", Extension: "exe", OS: "windows", Arch: "amd64"},
		{Name: "win32-arm64", Extension: "exe", OS: "windows", Arch: "arm64"},
		
		// Linux platforms
		{Name: "linux-x64", Extension: "AppImage", OS: "linux", Arch: "amd64"},
		{Name: "linux-arm64", Extension: "AppImage", OS: "linux", Arch: "arm64"},
	}
}

// GetCurrentPlatform returns the platform info for the current system
func GetCurrentPlatform() (PlatformInfo, error) {
	currentOS := runtime.GOOS
	currentArch := runtime.GOARCH
	
	for _, platform := range GetAllPlatforms() {
		if platform.OS == currentOS && platform.Arch == currentArch {
			return platform, nil
		}
	}
	
	return PlatformInfo{}, fmt.Errorf("unsupported platform: %s/%s", currentOS, currentArch)
}

// GetPlatformByName returns platform info by name
func GetPlatformByName(name string) (PlatformInfo, error) {
	for _, platform := range GetAllPlatforms() {
		if platform.Name == name {
			return platform, nil
		}
	}
	return PlatformInfo{}, fmt.Errorf("unknown platform: %s", name)
}

// GetPlatformNames returns all platform names
func GetPlatformNames() []string {
	platforms := GetAllPlatforms()
	names := make([]string, len(platforms))
	for i, platform := range platforms {
		names[i] = platform.Name
	}
	return names
}

// ConstructDownloadURL constructs the download URL for a given version and platform
func ConstructDownloadURL(version string, platform PlatformInfo) string {
	var filename string
	
	// Special handling for Windows platforms
	if platform.OS == "windows" {
		if platform.Arch == "amd64" {
			filename = "QoderUserSetup-x64.exe"
		} else if platform.Arch == "arm64" {
			filename = "QoderUserSetup-arm64.exe"
		}
	} else {
		// Default format for other platforms
		filename = fmt.Sprintf("Qoder-%s.%s", platform.Name, platform.Extension)
	}
	
	// Handle latest version
	if version == "latest" {
		return fmt.Sprintf("https://download.qoder.com/release/latest/%s", filename)
	}
	
	// Handle specific versions
	return fmt.Sprintf("https://download.qoder.com/release/%s/%s", version, filename)
}