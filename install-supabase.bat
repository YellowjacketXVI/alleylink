@echo off
echo Installing Supabase CLI...

REM Check if scoop is installed
scoop --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Scoop not found. Please install Scoop first.
    echo.
    echo Open PowerShell as Administrator and run:
    echo Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    echo Invoke-RestMethod -Uri https://get.scoop.sh ^| Invoke-Expression
    echo.
    pause
    exit /b 1
)

echo Scoop found. Installing Supabase CLI...
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

echo.
echo Verifying installation...
supabase --version

echo.
echo Supabase CLI installation complete!
pause
