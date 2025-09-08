#!/bin/bash

# Batch create GitHub releases for all downloaded versions
# This script will create a release for each version in the downloads directory
# and upload all corresponding files as assets

set -e  # Exit on any error

echo "🚀 Starting batch GitHub release creation..."
echo "======================================="

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

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Get all version directories, sorted
versions=$(ls -1 downloads/ | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -V)

if [ -z "$versions" ]; then
    echo "❌ No version directories found in downloads/"
    exit 1
fi

echo "📦 Found versions to process:"
echo "$versions"
echo ""

# Process each version
for version in $versions; do
    echo "🔄 Processing version $version..."
    
    version_dir="downloads/$version"
    
    # Check if version directory exists and has files
    if [ ! -d "$version_dir" ]; then
        echo "⚠️  Warning: Directory $version_dir does not exist, skipping..."
        continue
    fi
    
    # Get all files in the version directory
    files=$(find "$version_dir" -type f -name "qoder-*" | sort)
    
    if [ -z "$files" ]; then
        echo "⚠️  Warning: No qoder files found in $version_dir, skipping..."
        continue
    fi
    
    echo "📁 Files to upload for v$version:"
    echo "$files" | sed 's/^/   - /'
    
    # Check if release already exists
    if gh release view "v$version" &> /dev/null; then
        echo "ℹ️  Release v$version already exists, skipping..."
        echo ""
        continue
    fi
    
    # Create release notes based on version
    release_notes="Release v$version

This release includes:
$(echo "$files" | while read -r file; do
    filename=$(basename "$file")
    echo "- $filename"
done)

Downloaded from official Qoder releases."
    
    # Create the release
    echo "🏷️  Creating release v$version..."
    
    # Build gh release create command
    gh_cmd="gh release create v$version"
    
    # Add all files as arguments
    for file in $files; do
        gh_cmd="$gh_cmd \"$file\""
    done
    
    # Add release options
    gh_cmd="$gh_cmd --title \"v$version\" --notes \"$release_notes\""
    
    # Execute the command
    if eval "$gh_cmd"; then
        echo "✅ Successfully created release v$version"
    else
        echo "❌ Failed to create release v$version"
        exit 1
    fi
    
    echo ""
done

echo "🎉 All releases created successfully!"
echo "📋 Summary:"
gh release list --limit 50