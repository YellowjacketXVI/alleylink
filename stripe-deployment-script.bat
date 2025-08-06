@echo off
echo 🚀 Deploying Stripe Integration for AlleyLink...

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Supabase CLI...
    npm install -g supabase
)

REM Login to Supabase
echo 🔐 Logging into Supabase...
supabase login

REM Link to your project
echo 🔗 Linking to Affiliate-Gate project...
supabase link --project-ref eyafgfuxvarbpkhjkuxq

REM Set environment variables
echo ⚙️ Setting Stripe environment variables...
supabase secrets set STRIPE_SECRET_KEY=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
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx
supabase secrets set STRIPE_PRICE_PRO_MONTHLY=price_1Rrki6DGBbR8XeGsrr4iz7TY
supabase secrets set SITE_URL=https://alleylink.com

echo ✅ Environment variables set!

REM Deploy Edge Functions
echo 🚀 Deploying Edge Functions...
supabase functions deploy create-subscription
supabase functions deploy stripe-webhook
supabase functions deploy customer-portal

echo ✅ All Edge Functions deployed!

REM Display success message
echo.
echo 🎉 Stripe Integration Complete!
echo.
echo 🔗 Your webhook URL:
echo    https://eyafgfuxvarbpkhjkuxq.supabase.co/functions/v1/stripe-webhook
echo.
echo 📋 Next steps:
echo    1. Configure webhook in Stripe Dashboard with the URL above
echo    2. Test payment flow on your site
echo    3. Go live!
echo.
echo ✅ Your AlleyLink platform is ready for live payments!
pause