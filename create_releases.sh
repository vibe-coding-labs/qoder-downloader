#!/bin/bash

# Script to create GitHub releases for newly detected Qoder versions

set -e  # Exit on any error

echo "Detecting new Qoder versions..."

# Run the detection command to find all available versions
go run main.go detect --max-major 3 --max-minor 20 --max-patch 50

echo "Checking for new versions compared to existing releases..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

# Get the list of existing tags from GitHub
EXISTING_TAGS=$(gh api repos/vibe-coding-labs/qoder-downloader/releases --jq '.[].tag_name' 2>/dev/null || echo "")

# Get the latest cached versions
go run main.go detect --show-cached > temp_versions.txt
CACHED_VERSIONS=$(sed -n '/Cached valid versions/,/^$/p' temp_versions.txt | tail -n +2 | head -n -1 | tr -d ' ')

echo "Cached versions:"
echo "$CACHED_VERSIONS"

# Loop through each cached version and create a release if it doesn't exist
for version in $CACHED_VERSIONS; do
    # Ensure version is in the right format (remove leading/trailing spaces)
    version=$(echo $version | xargs)
    
    if [[ -z "$version" ]]; then
        continue
    fi
    
    echo "Checking version: $version"
    
    # Check if this version already exists as a tag
    if echo "$EXISTING_TAGS" | grep -q "^v$version$"; then
        echo "Version v$version already exists as a release, skipping..."
    else
        echo "Creating release for version v$version"
        
        # Create a release for this version
        gh release create "v$version" \
            --title "Qoder v$version" \
            --notes "Automated release for Qoder version $version" \
            --target main
        
        echo "Successfully created release for v$version"
    fi
done

# Clean up temporary file
rm -f temp_versions.txt

echo "Release creation process completed!"