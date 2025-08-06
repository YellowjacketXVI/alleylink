#!/bin/bash

# AlleyLink Stripe Configuration Deployment Script
# Run this script to configure your Supabase project with Stripe

echo "🚀 Configuring AlleyLink with Stripe Live Keys..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "🔐 Logging into Supabase..."
supabase login

# Link to your project
echo "🔗 Linking to Affiliate-Gate project..."
supabase link --project-ref eyafgfuxvarbpkhjkuxq

# Set environment variables
echo "⚙️ Setting Stripe environment variables..."

# Set Stripe Secret Key
supabase secrets set STRIPE_SECRET_KEY=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

# Set Webhook Secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx

# Set Site URL
supabase secrets set SITE_URL=https://alleylink.com

# Set Price ID (your actual Price ID)
PRICE_ID="price_1Rrki6DGBbR8XeGsrr4iz7TY"
echo "💰 Setting Price ID: $PRICE_ID"

# Set Price ID
supabase secrets set STRIPE_PRICE_PRO_MONTHLY=$PRICE_ID

echo "✅ Environment variables set successfully!"

# Deploy Edge Functions
echo "🚀 Deploying Edge Functions..."

# Deploy create-subscription function
echo "📦 Deploying create-subscription function..."
supabase functions deploy create-subscription

# Deploy stripe-webhook function
echo "📦 Deploying stripe-webhook function..."
supabase functions deploy stripe-webhook

# Deploy customer-portal function
echo "📦 Deploying customer-portal function..."
supabase functions deploy customer-portal

echo "✅ All Edge Functions deployed successfully!"

# Display webhook URL
echo ""
echo "🔗 Your Stripe webhook URL is:"
echo "   https://eyafgfuxvarbpkhjkuxq.supabase.co/functions/v1/stripe-webhook"
echo ""
echo "📋 Make sure this URL is configured in your Stripe Dashboard webhook settings"

# Display next steps
echo ""
echo "🎉 Stripe configuration complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your frontend .env file with:"
echo "      VITE_STRIPE_PUBLISHABLE_KEY=pk_live_l3DJeztxsxijCpy2hAuQ90VK"
echo "      VITE_STRIPE_PRICE_PRO_MONTHLY=$PRICE_ID"
echo ""
echo "   2. Rebuild and deploy your frontend"
echo "   3. Test the payment flow"
echo "   4. Go live!"
echo ""
echo "✅ Your AlleyLink platform is ready for live Stripe payments!"
