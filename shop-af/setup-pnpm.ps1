Write-Host "Setting up project for pnpm development..." -ForegroundColor Green

Write-Host "`nStep 1: Checking if pnpm is installed..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version 2>$null
    Write-Host "pnpm is already installed (version: $pnpmVersion)" -ForegroundColor Green
} catch {
    Write-Host "pnpm is not installed. Installing pnpm globally..." -ForegroundColor Yellow
    try {
        npm install -g pnpm
        Write-Host "pnpm installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to install pnpm. Please install Node.js first." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "`nStep 2: Removing existing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "Removed existing node_modules directory." -ForegroundColor Green
} else {
    Write-Host "No existing node_modules directory found." -ForegroundColor Green
}

Write-Host "`nStep 3: Installing dependencies with pnpm..." -ForegroundColor Yellow
try {
    pnpm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to install dependencies." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`nStep 4: Setup complete!" -ForegroundColor Green
Write-Host "`nYou can now run:" -ForegroundColor Cyan
Write-Host "  pnpm dev          - Start development server" -ForegroundColor White
Write-Host "  pnpm build        - Build for production" -ForegroundColor White
Write-Host "  pnpm preview      - Preview production build" -ForegroundColor White
Write-Host "  pnpm lint         - Run linting" -ForegroundColor White

Read-Host "`nPress Enter to exit"
