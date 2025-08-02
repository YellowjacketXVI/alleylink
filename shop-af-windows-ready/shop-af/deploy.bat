@echo off
echo ========================================
echo Shop AF Deployment Script
echo ========================================
echo.

echo [1/4] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build successful!
echo.

echo [2/4] Verifying build output...
if not exist "dist\index.html" (
    echo ERROR: index.html not found in dist folder!
    pause
    exit /b 1
)
if not exist "dist\assets" (
    echo ERROR: assets folder not found in dist folder!
    pause
    exit /b 1
)
echo ✓ Build output verified!
echo.

echo [3/4] Checking file sizes...
for %%f in (dist\assets\*.js) do (
    echo JavaScript bundle: %%~nxf (%%~zf bytes)
)
for %%f in (dist\assets\*.css) do (
    echo CSS bundle: %%~nxf (%%~zf bytes)
)
echo.

echo [4/4] Deployment ready!
echo.
echo ========================================
echo DEPLOYMENT INSTRUCTIONS:
echo ========================================
echo.
echo 1. Upload the contents of the 'dist' folder to your web server
echo 2. Ensure index.html is at the root of your web directory
echo 3. Configure your server for SPA routing (if needed)
echo 4. Create the SQL function in Supabase (see DEPLOYMENT_GUIDE.md)
echo 5. Set environment variables on your hosting platform
echo.
echo Files to upload:
dir dist /b
echo.
echo For detailed instructions, see:
echo - DEPLOYMENT_GUIDE.md
echo - DEPLOYMENT_VERIFICATION.md
echo.
echo ✓ Ready for production deployment!
echo.
pause
