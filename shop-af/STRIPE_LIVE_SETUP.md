# 🔴 LIVE STRIPE SETUP - AlleyLink Production

## ⚠️ **IMPORTANT: Live Stripe Keys Configuration**

You have provided your live Stripe keys. Here's the complete setup guide for production.

### 🔑 **Your Stripe Live Credentials:**

```bash
# Stripe Live Keys (PRODUCTION)
STRIPE_PUBLISHABLE_KEY=pk_live_l3DJeztxsxijCpy2hAuQ90VK
STRIPE_SECRET_KEY=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
```

### 🚀 **Step-by-Step Production Setup:**

#### **1. Set Environment Variables in Supabase**

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to your Supabase Dashboard → Project Settings → Edge Functions
2. Add these environment variables:

```bash
STRIPE_SECRET_KEY=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
SITE_URL=https://alleylink.com
```

**Option B: Via Supabase CLI**
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref eyafgfuxvarbpkhjkuxq

# Set environment variables
supabase secrets set STRIPE_SECRET_KEY=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
supabase secrets set SITE_URL=https://alleylink.com
```

#### **2. Create Stripe Product & Price**

**In your Stripe Dashboard:**
1. **Go to Products** → Create Product
2. **Product Name**: "AlleyLink Pro"
3. **Pricing**: $4.99 USD, Recurring monthly
4. **Copy the Price ID** (starts with `price_`) - you'll need this

#### **3. Set Stripe Price ID**

**Add the price ID to Supabase environment variables:**
```bash
# Replace price_xxxxx with your actual price ID
STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
```

#### **4. Deploy Edge Functions**

**Deploy all 3 Edge Functions to Supabase:**

```bash
# Deploy create-subscription function
supabase functions deploy create-subscription

# Deploy stripe-webhook function  
supabase functions deploy stripe-webhook

# Deploy customer-portal function
supabase functions deploy customer-portal
```

#### **5. Configure Stripe Webhook**

**In your Stripe Dashboard:**
1. **Go to Webhooks** → Add Endpoint
2. **Endpoint URL**: `https://eyafgfuxvarbpkhjkuxq.supabase.co/functions/v1/stripe-webhook`
3. **Events to Send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy the Webhook Secret** (starts with `whsec_`)

#### **6. Set Webhook Secret**

**Add webhook secret to Supabase:**
```bash
# Replace whsec_xxxxx with your actual webhook secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 🌐 **Frontend Environment Variables**

**Update your `.env` file for the frontend:**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://eyafgfuxvarbpkhjkuxq.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_l3DJeztxsxijCpy2hAuQ90VK
VITE_STRIPE_PRICE_PRO_MONTHLY=price_xxxxx  # Replace with your price ID
```

### 🧪 **Testing the Integration**

#### **Test with Stripe Test Cards:**
```bash
# Successful payment
4242 4242 4242 4242

# Declined payment
4000 0000 0000 0002

# Requires authentication
4000 0025 0000 3155
```

#### **Test Flow:**
1. **Go to** https://alleylink.com/pricing
2. **Click "Start Pro Trial"**
3. **Complete checkout** with test card
4. **Verify** user gets Pro access
5. **Test** subscription management in dashboard

### 🔒 **Security Recommendations**

#### **✅ Immediate Actions:**
1. **Rotate Keys**: After setup, generate new Stripe keys for security
2. **Webhook Security**: Ensure webhook endpoint is properly secured
3. **Environment Variables**: Never commit live keys to version control
4. **Access Control**: Limit who has access to Stripe dashboard

#### **✅ Monitoring:**
1. **Set up Stripe alerts** for failed payments
2. **Monitor webhook delivery** in Stripe dashboard
3. **Check Supabase logs** for Edge Function errors
4. **Set up user notification** for subscription changes

### 📊 **Production Checklist:**

#### **✅ Stripe Configuration:**
- [ ] Product created ($4.99/month)
- [ ] Price ID copied and configured
- [ ] Webhook endpoint created
- [ ] Webhook secret configured
- [ ] Live keys set in Supabase

#### **✅ Supabase Configuration:**
- [ ] Edge Functions deployed
- [ ] Environment variables set
- [ ] Database schema updated
- [ ] RLS policies verified

#### **✅ Frontend Configuration:**
- [ ] Live publishable key set
- [ ] Price ID configured
- [ ] Build deployed to production
- [ ] SSL certificate active

#### **✅ Testing:**
- [ ] Checkout flow tested
- [ ] Webhook delivery verified
- [ ] Subscription management tested
- [ ] Cancellation flow tested

### 🚨 **Important Notes:**

#### **Live Environment:**
- **Real payments** will be processed
- **Real customers** will be charged
- **Real subscriptions** will be created
- **Test carefully** before going live

#### **Support:**
- **Stripe Support**: Available 24/7 for payment issues
- **Webhook Logs**: Check Stripe dashboard for delivery status
- **Supabase Logs**: Monitor Edge Function execution
- **User Support**: Have cancellation process ready

### 🎉 **Go Live:**

Once all steps are completed:
1. **Deploy your frontend** to https://alleylink.com
2. **Test the complete flow** with a small amount
3. **Monitor for 24 hours** to ensure stability
4. **Announce** your Pro plan to users

**Your AlleyLink platform is now ready for live Stripe payments!** 🚀

**⚠️ Remember to rotate your Stripe keys after setup for maximum security.**
