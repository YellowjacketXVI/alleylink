# 📋 Manual Stripe Setup Guide - AlleyLink

## 🎯 **Complete Manual Setup Instructions**

Since you have provided your Stripe details, here's the complete manual setup guide.

### 🔑 **Your Stripe Configuration:**

```bash
Product ID: prod_SnLOqLoCIOTPlR
Webhook Secret: whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx
Publishable Key: pk_live_l3DJeztxsxijCpy2hAuQ90VK
Secret Key: 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
```

## 🚨 **STEP 1: Get Your Price ID (CRITICAL)**

**You provided the Product ID, but I need the Price ID:**

1. **Go to** [Stripe Dashboard](https://dashboard.stripe.com)
2. **Navigate to** Products → Find "AlleyLink Pro"
3. **Click on the product**
4. **Look for the pricing section** - you should see $4.99/month
5. **Copy the Price ID** (starts with `price_`) - NOT the product ID
6. **Save this Price ID** - you'll need it for all configurations

## 🔧 **STEP 2: Configure Supabase Environment Variables**

### **Via Supabase Dashboard:**

1. **Go to** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select** your "Affiliate-Gate" project
3. **Navigate to** Settings → Edge Functions
4. **Click** "Environment Variables" or "Secrets"
5. **Add these 4 variables:**

```bash
Variable 1:
Name: STRIPE_SECRET_KEY
Value: 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

Variable 2:
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx

Variable 3:
Name: STRIPE_PRICE_PRO_MONTHLY
Value: price_YOUR_ACTUAL_PRICE_ID_HERE

Variable 4:
Name: SITE_URL
Value: https://alleylink.com
```

## 🚀 **STEP 3: Deploy Edge Functions**

### **Option A: Via Supabase Dashboard**

1. **Go to** Edge Functions in your Supabase Dashboard
2. **Create 3 new functions** with these exact names:
   - `create-subscription`
   - `stripe-webhook`
   - `customer-portal`

3. **For each function, copy the code from these files:**
   - `supabase/functions/create-subscription/index.ts`
   - `supabase/functions/stripe-webhook/index.ts`
   - `supabase/functions/customer-portal/index.ts`

### **Option B: Via CLI (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref eyafgfuxvarbpkhjkuxq

# Deploy functions
supabase functions deploy create-subscription
supabase functions deploy stripe-webhook
supabase functions deploy customer-portal
```

## 🔗 **STEP 4: Verify Webhook URL**

**Your webhook URL should be:**
```
https://eyafgfuxvarbpkhjkuxq.supabase.co/functions/v1/stripe-webhook
```

**Make sure this matches exactly in your Stripe Dashboard webhook settings.**

## 🌐 **STEP 5: Update Frontend Environment Variables**

### **Create/Update your .env file:**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://eyafgfuxvarbpkhjkuxq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWZnZnV4dmFyYnBraGprdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NTU4NzQsImV4cCI6MjA1MTQzMTg3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8

# Stripe Configuration (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_l3DJeztxsxijCpy2hAuQ90VK
VITE_STRIPE_PRICE_PRO_MONTHLY=price_YOUR_ACTUAL_PRICE_ID_HERE
```

### **For hosting platforms (Netlify/Vercel):**
Add these same environment variables in your hosting platform's settings.

## 🧪 **STEP 6: Test the Integration**

### **Test Webhook Delivery:**
1. **Stripe Dashboard** → **Developers** → **Webhooks**
2. **Click your webhook endpoint**
3. **Send test webhook** → `checkout.session.completed`
4. **Verify success** in delivery logs

### **Test Payment Flow:**
1. **Use Stripe test cards first:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
2. **Go through complete checkout process**
3. **Verify user gets Pro access**
4. **Test subscription management**

## ✅ **STEP 7: Go Live Checklist**

### **Before Going Live:**
- [ ] **Price ID obtained** and configured everywhere
- [ ] **Environment variables set** in Supabase
- [ ] **Edge Functions deployed** successfully
- [ ] **Frontend environment variables** updated
- [ ] **Webhook delivery tested** and working
- [ ] **Payment flow tested** end-to-end
- [ ] **Customer portal tested** for subscription management

### **Security Check:**
- [ ] **Live keys secured** (not in code repository)
- [ ] **Webhook signature validation** working
- [ ] **SSL certificate** active on alleylink.com
- [ ] **Error monitoring** set up

## 🚨 **CRITICAL: Missing Price ID**

**The most important step is getting your Price ID from Stripe Dashboard.**

**Without the correct Price ID, payments will not work!**

### **To find it:**
1. **Stripe Dashboard** → **Products** → **AlleyLink Pro**
2. **Look for $4.99/month pricing**
3. **Copy the ID that starts with `price_`**
4. **Replace `price_YOUR_ACTUAL_PRICE_ID_HERE` everywhere**

## 🎉 **Once Complete:**

Your AlleyLink platform will have:
- ✅ **Live Stripe payments** processing
- ✅ **7-day free trial** for Pro plan
- ✅ **Automatic subscription management**
- ✅ **Customer portal** for self-service
- ✅ **Real-time webhook processing**

**Get your Price ID and complete the setup to go live!** 🚀
