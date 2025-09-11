@echo off
echo Setting up project for pnpm development...

echo.
echo Step 1: Checking if pnpm is installed...
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo pnpm is not installed. Installing pnpm globally...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo Failed to install pnpm. Please install Node.js first.
        pause
        exit /b 1
    )
) else (
    echo pnpm is already installed.
)

echo.
echo Step 2: Removing existing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo Removed existing node_modules directory.
) else (
    echo No existing node_modules directory found.
)

echo.
echo Step 3: Installing dependencies with pnpm...
pnpm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Step 4: Setup complete!
echo.
echo You can now run:
echo   pnpm dev          - Start development server
echo   pnpm build        - Build for production
echo   pnpm preview      - Preview production build
echo   pnpm lint         - Run linting
echo.
pause
