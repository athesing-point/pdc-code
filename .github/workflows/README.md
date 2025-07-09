# GitHub Actions Workflow: Deploy Assets to R2

This document explains the `deploy_assets.yml` GitHub Actions workflow that automatically builds and deploys static assets to Cloudflare R2 storage.

## Overview

The workflow automatically builds JavaScript assets and deploys them to Cloudflare R2 storage whenever code is pushed to the `main` or `staging` branches. It also purges the Cloudflare cache for any updated files.

## Trigger Conditions

The workflow runs on:

- Push to `main` branch → deploys to production environment
- Push to `staging` branch → deploys to staging environment

## Required Secrets

The following secrets must be configured in your GitHub repository settings:

| Secret          | Description                                              |
| --------------- | -------------------------------------------------------- |
| `CF_API_TOKEN`  | Cloudflare API token with R2 and Cache purge permissions |
| `CF_ACCOUNT_ID` | Your Cloudflare account ID                               |
| `CF_ZONE_ID`    | Cloudflare zone ID for cache purging                     |

## Environment Variables

| Variable    | Value        | Description                             |
| ----------- | ------------ | --------------------------------------- |
| `R2_BUCKET` | `CDN_BUCKET` | Name of the R2 bucket for asset storage |

## Workflow Steps

### 1. Environment Setup

- **Checkout repository**: Fetches the code with 2 commits of history (needed for file change detection)
- **Setup Bun**: Installs the latest version of Bun runtime
- **Install dependencies**: Runs `bun install` to install project dependencies
- **Install Wrangler**: Installs Cloudflare's CLI tool globally

### 2. Environment Detection

Determines the target environment based on the branch:

- `main` branch → `production` environment, builds to `dist/prod`
- `staging` branch → `staging` environment, builds to `dist/staging`

### 3. Asset Building

Runs the appropriate build command:

- Production: `bun run build:prod`
- Staging: `bun run build:staging`

### 4. R2 Deployment

- **Create bucket**: Ensures the R2 bucket exists (fails gracefully if it already exists)
- **Sync assets**: Uploads built assets to R2 with environment-specific prefixes:
  - Production files → `production/` prefix
  - Staging files → `staging/` prefix

### 5. Cache Invalidation

#### File Change Detection

- For initial pushes: Lists all files in `dist/prod` and `dist/staging`
- For subsequent pushes: Compares current commit with previous commit to find changed files

#### URL Building

Converts changed file paths to CDN URLs:

- `dist/prod/file.js` → `https://files.point.com/code/prod/file.js`
- `dist/staging/file.js` → `https://files.point.com/code/staging/file.js`

#### Cache Purging

- Makes API calls to Cloudflare to purge cache for updated files
- Implements retry logic (3 attempts with 5-second delays)
- Validates both HTTP response and Cloudflare API success status

## CDN Structure

The deployed assets are accessible via:

- **Production**: `https://files.point.com/code/prod/[file-path]`
- **Staging**: `https://files.point.com/code/staging/[file-path]`

## Error Handling

The workflow includes robust error handling:

- Graceful bucket creation (continues if bucket exists)
- Directory existence validation before upload
- Retry logic for cache purging with detailed error reporting
- HTTP status code and API response validation

## Prerequisites

1. **Bun Configuration**: Project must have `build:prod` and `build:staging` scripts in `package.json`
2. **Output Directories**: Build scripts must output to `dist/prod` and `dist/staging` respectively
3. **Cloudflare Setup**:
   - R2 bucket permissions configured
   - Zone access for cache purging
   - API tokens with appropriate scopes

## Monitoring

The workflow provides detailed logging for:

- Environment detection
- Build process
- File upload progress
- Cache purge attempts and results
- Error details for troubleshooting

## Maintenance Notes

- The workflow uses `fetch-depth: 2` to enable file change detection
- Cache purging only occurs when files actually change
- Failed cache purges will fail the entire workflow to ensure consistency
- Wrangler is installed globally using npm (not Bun) for compatibility
