#!/bin/bash

echo "========================================"
echo "Shop AF Deployment Script"
echo "========================================"
echo

echo "[1/4] Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi
echo "✓ Build successful!"
echo

echo "[2/4] Verifying build output..."
if [ ! -f "dist/index.html" ]; then
    echo "ERROR: index.html not found in dist folder!"
    exit 1
fi
if [ ! -d "dist/assets" ]; then
    echo "ERROR: assets folder not found in dist folder!"
    exit 1
fi
echo "✓ Build output verified!"
echo

echo "[3/4] Checking file sizes..."
for file in dist/assets/*.js; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        echo "JavaScript bundle: $(basename "$file") ($size bytes)"
    fi
done
for file in dist/assets/*.css; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        echo "CSS bundle: $(basename "$file") ($size bytes)"
    fi
done
echo

echo "[4/4] Deployment ready!"
echo
echo "========================================"
echo "DEPLOYMENT INSTRUCTIONS:"
echo "========================================"
echo
echo "1. Upload the contents of the 'dist' folder to your web server"
echo "2. Ensure index.html is at the root of your web directory"
echo "3. Configure your server for SPA routing (if needed)"
echo "4. Create the SQL function in Supabase (see DEPLOYMENT_GUIDE.md)"
echo "5. Set environment variables on your hosting platform"
echo
echo "Files to upload:"
ls -la dist/
echo
echo "For detailed instructions, see:"
echo "- DEPLOYMENT_GUIDE.md"
echo "- DEPLOYMENT_VERIFICATION.md"
echo
echo "✓ Ready for production deployment!"
echo
