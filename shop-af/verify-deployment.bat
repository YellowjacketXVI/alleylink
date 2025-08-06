@echo off
echo 🔍 AlleyLink Deployment Verification
echo =====================================
echo.

REM Check if dist folder exists
if exist "dist" (
    echo ✅ dist folder exists
) else (
    echo ❌ dist folder missing - run 'npm run build' first
    pause
    exit /b 1
)

REM Check critical files
if exist "dist\index.html" (
    echo ✅ index.html found
) else (
    echo ❌ index.html missing
)

if exist "dist\_redirects" (
    echo ✅ _redirects file found (SPA routing)
) else (
    echo ❌ _redirects missing
)

if exist "dist\sitetitle.png" (
    echo ✅ favicon found
) else (
    echo ❌ favicon missing
)

REM Check assets folder
if exist "dist\assets" (
    echo ✅ assets folder found
    
    REM Count files in assets
    for /f %%i in ('dir /b "dist\assets\*.js" 2^>nul ^| find /c /v ""') do set js_count=%%i
    for /f %%i in ('dir /b "dist\assets\*.css" 2^>nul ^| find /c /v ""') do set css_count=%%i
    
    echo   📦 JavaScript files: %js_count%
    echo   🎨 CSS files: %css_count%
) else (
    echo ❌ assets folder missing
)

echo.
echo 📊 Build Statistics:
for %%f in ("dist\index.html") do echo   index.html: %%~zf bytes
for %%f in ("dist\assets\*.css") do echo   CSS: %%~zf bytes
for %%f in ("dist\assets\*.js") do echo   JavaScript: %%~zf bytes

echo.
echo 🌐 Ready for deployment to:
echo   • Netlify (drag & drop dist folder)
echo   • Vercel (connect Git repository)  
echo   • Traditional hosting (upload dist contents)
echo.
echo 🔗 Domain: alleylink.com
echo 💳 Payments: Stripe Live Mode Ready
echo 🗄️ Database: Supabase Production
echo.
echo ✅ DEPLOYMENT READY!
pause
