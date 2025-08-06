# 🔧 Configure Stripe for AlleyLink - LIVE SETUP

## ✅ **Your Stripe Configuration Details**

Based on your Stripe setup, here are your configuration details:

```bash
# Your Stripe Live Configuration
PRODUCT_ID=prod_SnLOqLoCIOTPlR
WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx
PUBLISHABLE_KEY=pk_live_l3DJeztxsxijCpy2hAuQ90VK
SECRET_KEY=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
```

## 🚨 **CRITICAL: Get Your Price ID**

You provided the **Product ID** (`prod_SnLOqLoCIOTPlR`), but I need the **Price ID** for the $4.99/month plan.

### **To Get Your Price ID:**
1. **Go to Stripe Dashboard** → **Products**
2. **Click on "AlleyLink Pro"** (your product)
3. **Look for the pricing section** - you should see a price entry for $4.99/month
4. **Copy the Price ID** (starts with `price_`) - NOT the product ID

## 🔧 **Step 1: Configure Supabase Environment Variables**

### **Option A: Via Supabase Dashboard (Recommended)**
1. **Go to** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select your project**: Affiliate-Gate
3. **Go to** Settings → Edge Functions → Environment Variables
4. **Add these variables:**

```bash
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx
STRIPE_PRICE_PRO_MONTHLY=price_YOUR_PRICE_ID_HERE
SITE_URL=https://alleylink.com
```

### **Option B: Via Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref eyafgfuxvarbpkhjkuxq

# Set environment variables
supabase secrets set STRIPE_SECRET_KEY=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
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx
supabase secrets set STRIPE_PRICE_PRO_MONTHLY=price_YOUR_PRICE_ID_HERE
supabase secrets set SITE_URL=https://alleylink.com
```

## 🚀 **Step 2: Deploy Edge Functions**

### **Deploy all 3 Edge Functions:**
```bash
# Deploy create-subscription function
supabase functions deploy create-subscription

# Deploy stripe-webhook function
supabase functions deploy stripe-webhook

# Deploy customer-portal function
supabase functions deploy customer-portal
```

## 🌐 **Step 3: Update Frontend Environment Variables**

### **Create/Update your .env file:**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://eyafgfuxvarbpkhjkuxq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWZnZnV4dmFyYnBraGprdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NTU4NzQsImV4cCI6MjA1MTQzMTg3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8

# Stripe Configuration (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_l3DJeztxsxijCpy2hAuQ90VK
VITE_STRIPE_PRICE_PRO_MONTHLY=price_YOUR_PRICE_ID_HERE
```

## 🧪 **Step 4: Test the Integration**

### **Test Webhook Delivery:**
1. **Go to Stripe Dashboard** → **Developers** → **Webhooks**
2. **Click on your webhook endpoint**
3. **Click "Send test webhook"**
4. **Select** `checkout.session.completed`
5. **Verify** it shows "Success" in the delivery log

### **Test Payment Flow:**
1. **Go to** your staging/test site
2. **Click "Upgrade to Pro"**
3. **Use Stripe test card**: `4242 4242 4242 4242`
4. **Complete checkout**
5. **Verify** user gets Pro access

## 📋 **Verification Checklist**

### **✅ Stripe Dashboard:**
- [ ] Product created: "AlleyLink Pro" ($4.99/month)
- [ ] Price ID copied (starts with `price_`)
- [ ] Webhook endpoint configured
- [ ] Webhook secret copied
- [ ] Customer portal enabled

### **✅ Supabase Configuration:**
- [ ] Environment variables set
- [ ] Edge Functions deployed
- [ ] Database schema updated
- [ ] Webhook endpoint accessible

### **✅ Frontend Configuration:**
- [ ] Environment variables updated
- [ ] Application rebuilt
- [ ] Deployed to production

## 🚨 **IMPORTANT: Missing Price ID**

**You MUST get your Price ID before the system will work!**

### **To find your Price ID:**
1. **Stripe Dashboard** → **Products** → **AlleyLink Pro**
2. **Look for the $4.99/month price**
3. **Copy the ID that starts with `price_`**
4. **Replace `price_YOUR_PRICE_ID_HERE` in all configurations**

## 🎯 **Once You Have the Price ID:**

1. **Update all environment variables** with the real Price ID
2. **Redeploy Edge Functions** if needed
3. **Rebuild and deploy frontend**
4. **Test complete payment flow**
5. **Go live!**

## 📞 **Need Help?**

If you need help finding your Price ID or have issues:
1. **Check Stripe Dashboard** → **Products** → **AlleyLink Pro**
2. **Look for the pricing section**
3. **The Price ID should be visible next to $4.99/month**

**Once you have the Price ID, replace it in all the configurations above and your Stripe integration will be complete!**
