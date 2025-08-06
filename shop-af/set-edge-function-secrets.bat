@echo off
echo 🔧 Setting Edge Function Environment Variables...
echo.

REM Set Stripe Secret Key
echo Setting STRIPE_SECRET_KEY...
supabase secrets set STRIPE_SECRET_KEY=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 --project-ref eyafgfuxvarbpkhjkuxq

REM Set Webhook Secret
echo Setting STRIPE_WEBHOOK_SECRET...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx --project-ref eyafgfuxvarbpkhjkuxq

REM Set Price ID
echo Setting STRIPE_PRICE_PRO_MONTHLY...
supabase secrets set STRIPE_PRICE_PRO_MONTHLY=price_1Rrki6DGBbR8XeGsrr4iz7TY --project-ref eyafgfuxvarbpkhjkuxq

REM Set Site URL
echo Setting SITE_URL...
supabase secrets set SITE_URL=https://alleylink.com --project-ref eyafgfuxvarbpkhjkuxq

echo.
echo ✅ All environment variables set!
echo 🧪 Now test the "Upgrade to Pro" button
pause
