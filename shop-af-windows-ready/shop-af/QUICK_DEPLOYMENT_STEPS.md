# 🚀 QUICK DEPLOYMENT - Fix Payment Buttons Now

## 🚨 **IMMEDIATE ACTION REQUIRED**

Your payment buttons are failing because Edge Functions aren't deployed. Here's the fastest way to fix it:

## ⚡ **FASTEST METHOD: Supabase CLI (5 minutes)**

### **1. Install & Setup**
```bash
npm install -g supabase
supabase login
supabase link --project-ref eyafgfuxvarbpkhjkuxq
```

### **2. Set Environment Variables**
```bash
supabase secrets set STRIPE_SECRET_KEY=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
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx
supabase secrets set STRIPE_PRICE_PRO_MONTHLY=price_1Rrki6DGBbR8XeGsrr4iz7TY
supabase secrets set SITE_URL=https://alleylink.com
```

### **3. Deploy Functions**
```bash
supabase functions deploy create-subscription
supabase functions deploy stripe-webhook
supabase functions deploy customer-portal
```

## 🔧 **ALTERNATIVE: Supabase Dashboard (10 minutes)**

### **1. Go to Supabase Dashboard**
- Visit: https://supabase.com/dashboard
- Select: Affiliate-Gate project
- Navigate: Edge Functions

### **2. Set Environment Variables**
- Go to: Settings → Edge Functions → Environment Variables
- Add the 4 variables from above

### **3. Create Functions**
- Create function: `create-subscription`
- Copy code from: `create-subscription-function.ts`
- Create function: `customer-portal`
- Copy code from: `customer-portal-function.ts`
- Create function: `stripe-webhook`
- Copy code from: `supabase/functions/stripe-webhook/index.ts`

## ✅ **VERIFICATION**

After deployment:
1. **Refresh browser**
2. **Click "Upgrade to Pro"**
3. **Should redirect to Stripe checkout**
4. **No more CORS errors**

## 🎯 **RESULT**

- ✅ Payment buttons work
- ✅ Stripe checkout launches
- ✅ Subscription management active
- ✅ CORS errors resolved

**Deploy now to fix the payment system!**
