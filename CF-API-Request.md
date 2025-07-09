# Cloudflare API Access Request

## Overview

This document outlines the Cloudflare API credentials and permissions needed to enable the automated asset deployment workflow in the `pdc-code` repository.

## Required API Credentials

The following secrets need to be configured in GitHub Actions for the repository:

### 1. CF_API_TOKEN

- **Purpose**: Authentication for Cloudflare API operations
- **Required Permissions**:
  - R2 bucket management (create, read, write)
  - Cache purge operations
- **Scope**: Account-level token with R2 and Zone permissions

### 2. CF_ACCOUNT_ID

- **Purpose**: Identifies the Cloudflare account for R2 operations
- **Format**: Cloudflare Account ID (alphanumeric string)
- **Location**: Found in Cloudflare Dashboard → Right sidebar

### 3. CF_ZONE_ID

- **Purpose**: Identifies the specific zone for cache purge operations
- **Domain**: `point.com`
- **Location**: Found in Cloudflare Dashboard → Domain overview → API section

## Required Permissions

The API token needs the following permissions:

### R2 Storage Permissions

- **R2:Edit** - To manage the existing CDN_BUCKET (upload/delete files)
- **R2:Read** - To list and verify bucket contents
- **Account:Read** - To access account-level R2 resources

### Zone Permissions

- **Zone:Edit** - To selectively purge cache for specific files in the `/code/` path of our CDN (e.g., `files.point.com/code/prod/*`, `files.point.com/code/staging/*`), not the entire `point.com` domain
- **Zone:Read** - To access zone information

## API Operations Used

1. **File Upload**: Upload assets to existing CDN_BUCKET with environment prefixes (`code/prod/` or `code/staging/`)
2. **Selective Cache Purge**: Target-specific purge of individual updated files by their exact URLs:

   - `https://files.point.com/code/prod/[filename]`
   - `https://files.point.com/code/staging/[filename]`

   **Important**: This is NOT a zone-wide purge. Only the specific files that were updated during deployment will have their cache purged, ensuring minimal impact on other cached content.

## Security Considerations

- API token should be scoped to minimum required permissions
- Tokens should be stored as GitHub repository secrets (encrypted)

## Setup Instructions for GitHub Secrets

1. Navigate to repository Settings → Secrets and variables → Actions
2. Add the following repository secrets:
   - `CF_API_TOKEN`: [API token with required permissions]
   - `CF_ACCOUNT_ID`: [Cloudflare account ID]
   - `CF_ZONE_ID`: [Zone ID for point.com domain]

## Workflow Triggers

The deployment workflow runs on pushes to:

- `main` branch (production environment)
- `staging` branch (staging environment)

## Questions for Engineering/IT Team

1. Can you provide a Cloudflare API token with the specified permissions?
2. What is our Cloudflare Account ID?
3. What is the Zone ID for the `point.com` domain?
4. Are there any additional security policies or restrictions for API access?
