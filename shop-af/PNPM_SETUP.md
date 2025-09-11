# PNPM Development Setup

This project is now configured for development with pnpm, a fast and efficient package manager.

## Quick Setup

### Option 1: Automated Setup (Recommended)
Run one of these setup scripts:

**Windows Command Prompt:**
```cmd
setup-pnpm.bat
```

**PowerShell:**
```powershell
.\setup-pnpm.ps1
```

### Option 2: Manual Setup

1. **Install pnpm globally** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Remove existing node_modules** (if any):
   ```bash
   rm -rf node_modules
   ```

3. **Install dependencies with pnpm**:
   ```bash
   pnpm install
   ```

## Development Commands

Once setup is complete, use these commands:

- **Start development server**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Preview production build**: `pnpm preview`
- **Run linting**: `pnpm lint`
- **Clean install**: `pnpm run fresh-install`

## Why pnpm?

- **Faster**: pnpm is significantly faster than npm
- **Disk efficient**: Uses hard links and symlinks to save disk space
- **Strict**: Better dependency resolution and fewer phantom dependencies
- **Monorepo friendly**: Excellent workspace support

## Configuration Files

- `.npmrc` - pnpm configuration
- `pnpm-workspace.yaml` - Workspace configuration
- `pnpm-lock.yaml` - Lock file (equivalent to package-lock.json)

## Troubleshooting

If you encounter issues:

1. Make sure Node.js is installed and in your PATH
2. Run `pnpm --version` to verify pnpm is installed
3. Try `pnpm run fresh-install` to clean and reinstall dependencies
4. Check that you're in the correct directory (`shop-af`)

## Migration from npm

The project has been migrated from npm to pnpm:
- Scripts in `package.json` updated to use pnpm
- Added pnpm configuration files
- Existing `pnpm-lock.yaml` preserved
