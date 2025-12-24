# Install Supabase CLI on Windows
# Run this script in PowerShell as Administrator

Write-Host "Installing Supabase CLI..." -ForegroundColor Green

# Method 1: Try to install via Scoop
Write-Host "Checking if Scoop is installed..." -ForegroundColor Yellow

try {
    $scoopVersion = scoop --version
    Write-Host "Scoop is already installed: $scoopVersion" -ForegroundColor Green
} catch {
    Write-Host "Scoop not found. Installing Scoop..." -ForegroundColor Yellow
    
    # Set execution policy for current user
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    
    # Install Scoop
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
    
    Write-Host "Scoop installed successfully!" -ForegroundColor Green
}

# Install Supabase CLI via Scoop
Write-Host "Installing Supabase CLI via Scoop..." -ForegroundColor Yellow
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Verify installation
Write-Host "Verifying Supabase CLI installation..." -ForegroundColor Yellow
supabase --version

Write-Host "Supabase CLI installation complete!" -ForegroundColor Green
Write-Host "You can now use 'supabase' commands in your terminal." -ForegroundColor Green
