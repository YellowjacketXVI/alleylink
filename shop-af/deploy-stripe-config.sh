#!/bin/bash

# AlleyLink Stripe Configuration Deployment Script
# Run this script to configure your Supabase project with Stripe
#
# REQUIRED: Set these environment variables before running:
#   STRIPE_SECRET_KEY - Your Stripe secret key
#   STRIPE_WEBHOOK_SECRET - Your Stripe webhook secret
#   STRIPE_PRICE_PRO_MONTHLY - Your Stripe price ID for Pro plan
#   SUPABASE_PROJECT_REF - Your Supabase project reference

echo "🚀 Configuring AlleyLink with Stripe..."

# Check required environment variables
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ Error: STRIPE_SECRET_KEY environment variable is not set"
    echo "   Please set it before running this script:"
    echo "   export STRIPE_SECRET_KEY=your_stripe_secret_key"
    exit 1
fi

if [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "❌ Error: STRIPE_WEBHOOK_SECRET environment variable is not set"
    exit 1
fi

if [ -z "$STRIPE_PRICE_PRO_MONTHLY" ]; then
    echo "❌ Error: STRIPE_PRICE_PRO_MONTHLY environment variable is not set"
    exit 1
fi

SUPABASE_PROJECT_REF="${SUPABASE_PROJECT_REF:-eyafgfuxvarbpkhjkuxq}"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "🔐 Logging into Supabase..."
supabase login

# Link to your project
echo "🔗 Linking to project..."
supabase link --project-ref "$SUPABASE_PROJECT_REF"

# Set environment variables
echo "⚙️ Setting Stripe environment variables..."

supabase secrets set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"
supabase secrets set STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"
supabase secrets set SITE_URL=https://alleylink.com
supabase secrets set STRIPE_PRICE_PRO_MONTHLY="$STRIPE_PRICE_PRO_MONTHLY"

echo "✅ Environment variables set successfully!"

# Deploy Edge Functions
echo "🚀 Deploying Edge Functions..."

echo "📦 Deploying create-subscription function..."
supabase functions deploy create-subscription

echo "📦 Deploying stripe-webhook function..."
supabase functions deploy stripe-webhook

echo "📦 Deploying customer-portal function..."
supabase functions deploy customer-portal

echo "✅ All Edge Functions deployed successfully!"

# Display webhook URL
echo ""
echo "🔗 Your Stripe webhook URL is:"
echo "   https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/stripe-webhook"
echo ""
echo "📋 Make sure this URL is configured in your Stripe Dashboard webhook settings"

echo ""
echo "🎉 Stripe configuration complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your frontend .env file with your Stripe keys"
echo "   2. Rebuild and deploy your frontend"
echo "   3. Test the payment flow"
echo ""
echo "✅ Your AlleyLink platform is ready for Stripe payments!"
