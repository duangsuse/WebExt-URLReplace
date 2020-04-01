#!/usr/bin/bash

# Firefox extension build script
# Usage:
#   build.sh

# Delete old files
echo "Removing old build files..."
npm run clean

# Make build output dir
echo "Making firefox dir"
mkdir firefox

# Build
cp -r src/icons \
      src/_locales \
      src/*.js \
      src/options \
      LICENSE \
      src/manifest.json \
      firefox
