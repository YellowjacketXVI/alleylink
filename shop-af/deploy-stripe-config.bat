@echo off
echo 🚀 Configuring AlleyLink with Stripe Live Keys...

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found. Installing...
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

REM Set Stripe Secret Key
supabase secrets set STRIPE_SECRET_KEY=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

REM Set Webhook Secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx

REM Set Site URL
supabase secrets set SITE_URL=https://alleylink.com

REM Set Price ID (your actual Price ID)
set PRICE_ID=price_1Rrki6DGBbR8XeGsrr4iz7TY
echo 💰 Setting Price ID: %PRICE_ID%

REM Set Price ID
supabase secrets set STRIPE_PRICE_PRO_MONTHLY=%PRICE_ID%

echo ✅ Environment variables set successfully!

REM Deploy Edge Functions
echo 🚀 Deploying Edge Functions...

REM Deploy create-subscription function
echo 📦 Deploying create-subscription function...
supabase functions deploy create-subscription

REM Deploy stripe-webhook function
echo 📦 Deploying stripe-webhook function...
supabase functions deploy stripe-webhook

REM Deploy customer-portal function
echo 📦 Deploying customer-portal function...
supabase functions deploy customer-portal

echo ✅ All Edge Functions deployed successfully!

REM Display webhook URL
echo.
echo 🔗 Your Stripe webhook URL is:
echo    https://eyafgfuxvarbpkhjkuxq.supabase.co/functions/v1/stripe-webhook
echo.
echo 📋 Make sure this URL is configured in your Stripe Dashboard webhook settings

REM Display next steps
echo.
echo 🎉 Stripe configuration complete!
echo.
echo 📋 Next steps:
echo    1. Update your frontend .env file with:
echo       VITE_STRIPE_PUBLISHABLE_KEY=pk_live_l3DJeztxsxijCpy2hAuQ90VK
echo       VITE_STRIPE_PRICE_PRO_MONTHLY=%PRICE_ID%
echo.
echo    2. Rebuild and deploy your frontend
echo    3. Test the payment flow
echo    4. Go live!
echo.
echo ✅ Your AlleyLink platform is ready for live Stripe payments!

pause
