# PDC Code - Point.com CDN Build System

A build system for managing and deploying code bundles to Point.com's CDN infrastructure.

## Overview

This project provides a comprehensive build system that processes HTML, CSS, and JavaScript files for deployment to staging and production environments. The system handles minification, console log removal, and optimization for production builds while preserving readability for staging builds.

## Features

- **Multi-environment builds**: Separate staging and production builds
- **File processing**: Handles HTML, CSS, and JavaScript files
- **Production optimizations**:
  - Minification of all file types
  - Console log removal from JavaScript
  - Comment removal
  - Whitespace optimization
- **Staging builds**: Preserves formatting and console logs for debugging
- **Watch mode**: Auto-rebuild on file changes
- **Fast builds**: Powered by Bun and esbuild
- **Flexible source directories**: Build from any directory or root

## Installation

1. Install Bun (if not already installed):

```bash
curl -fsSL https://bun.sh/install | bash
```

2. Install dependencies:

```bash
cd pdc-code
bun install
```

## Project Structure

```
pdc-code/
├── src/              # Source files (HTML/CSS/JS)
├── dist/             # Build output
│   ├── staging/      # Staging builds
│   └── prod/         # Production builds
├── scripts/          # Build scripts
│   ├── build.js      # Main build script
│   ├── minify.js     # Minification functions
│   ├── utils.js      # Utility functions
│   └── clean.js      # Clean script
├── package.json      # Project configuration
└── README.md         # This file
```

## Usage

### Basic Commands

```bash
# Build for production (minified, no console logs)
bun run build:prod

# Build for staging (unminified, with console logs)
bun run build:staging

# Build both environments
bun run build:all

# Clean build artifacts
bun run clean

# Development build (alias for staging)
bun run dev
```

### Watch Mode

```bash
# Watch and rebuild staging on changes
bun run watch:staging

# Watch and rebuild production on changes
bun run watch:prod
```

### Custom Source Directory

```bash
# Build from a custom source directory
bun run scripts/build.js --env=production --src=custom-src
```

## File Processing

### Production Builds (`dist/prod/`)

- **HTML**: Minified, comments removed, whitespace collapsed
- **CSS**: Minified, comments removed, optimized
- **JavaScript**: Minified, console logs removed, comments removed, variables mangled

### Staging Builds (`dist/staging/`)

- **HTML**: Preserved formatting, comments kept
- **CSS**: Preserved formatting, comments kept
- **JavaScript**: Preserved formatting, console logs kept, comments kept

## Build Configuration

The build system automatically:

- Recursively processes all `.html`, `.css`, and `.js` files in the source directory
- Maintains directory structure in output
- Excludes `node_modules`, `.git`, and `dist` directories
- Provides build statistics and timing information

## Integration with CDN

The build outputs are designed to integrate with Point.com's CDN deployment workflow:

- **Production builds** → `files.point.com/code/prod/`
- **Staging builds** → `files.point.com/code/staging/`

The GitHub Actions workflow (configured separately) will automatically deploy files from the `dist/` directories to the appropriate CDN paths.

## Examples

### Adding Source Files

Create your HTML, CSS, and JavaScript files in the `src/` directory:

```
src/
├── components/
│   ├── header.html
│   ├── header.css
│   └── header.js
├── utils/
│   └── helpers.js
└── main.css
```

### Building

```bash
# Build staging version
bun run build:staging
# Output: dist/staging/components/header.html, etc.

# Build production version
bun run build:prod
# Output: dist/prod/components/header.html (minified), etc.
```

### Console Log Removal

JavaScript console statements are automatically removed in production builds:

```javascript
// Source file
console.log("Debug info");
console.warn("Warning message");
const result = calculateValue();

// Production output (console statements removed)
const result = calculateValue();

// Staging output (console statements preserved)
console.log("Debug info");
console.warn("Warning message");
const result = calculateValue();
```

## Development

### Adding New File Types

To support additional file types, modify:

1. `scripts/utils.js` - Update `shouldProcessFile()` function
2. `scripts/minify.js` - Add processing function for the new file type
3. `package.json` - Update file patterns in build commands

### Customizing Minification

Minification settings can be adjusted in `scripts/minify.js`:

- HTML minification options in `minifyHTML()`
- CSS minification via esbuild in `minifyCSS()`
- JavaScript minification and console log removal in `minifyJS()`

## Troubleshooting

### Build Fails

1. Check that source directory exists and contains supported files
2. Verify all dependencies are installed: `bun install`
3. Check file permissions for the output directory

### Watch Mode Issues

1. Ensure the source directory is accessible
2. Check that file patterns match your source files
3. Restart watch mode if files aren't being detected

### Minification Errors

The build system includes error handling - if minification fails for a file, it will:

1. Log a warning message
2. Use the original file content
3. Continue building other files

## License

ISC License - Point.com
