# 🔧 Supabase CLI Setup Guide for Windows

## 🎯 **Goal**
Install Supabase CLI to deploy the Basic tier Edge Function fix and resolve the subscription billing issue.

## 📋 **Installation Options**

### **Option 1: Scoop Package Manager (Recommended)**

#### **Step 1: Install Scoop**
1. **Open PowerShell as Administrator**
   - Press `Win + X` → Select "Windows PowerShell (Admin)"
   - Or search "PowerShell" → Right-click → "Run as administrator"

2. **Set Execution Policy**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Install Scoop**
   ```powershell
   Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
   ```

#### **Step 2: Install Supabase CLI**
```powershell
# Add Supabase bucket
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# Install Supabase CLI
scoop install supabase
```

#### **Step 3: Verify Installation**
```powershell
supabase --version
```

---

### **Option 2: Direct Download (Alternative)**

#### **Step 1: Download Binary**
1. Go to [Supabase CLI Releases](https://github.com/supabase/cli/releases)
2. Download the latest Windows binary: `supabase_windows_amd64.tar.gz`
3. Extract to a folder (e.g., `C:\supabase\`)

#### **Step 2: Add to PATH**
1. Open System Properties → Environment Variables
2. Add `C:\supabase\` to your PATH variable
3. Restart PowerShell/Command Prompt

---

### **Option 3: Using Chocolatey**

#### **If you have Chocolatey installed:**
```powershell
choco install supabase
```

---

## 🚀 **After Installation - Deploy the Fix**

### **Step 1: Navigate to Project**
```bash
cd X:\alleylink\shop-af
```

### **Step 2: Login to Supabase**
```bash
supabase login
```
- This will open a browser to authenticate
- Login with your Supabase account

### **Step 3: Link to Project**
```bash
supabase link --project-ref eyafgfuxvarbpkhjkuxq
```

### **Step 4: Deploy the Fixed Edge Function**
```bash
supabase functions deploy create-subscription --project-ref eyafgfuxvarbpkhjkuxq
```

### **Step 5: Set Environment Variable**
```bash
supabase secrets set STRIPE_PRICE_BASIC_MONTHLY=price_1SB68VDGBbR8XeGs5EqAmqyu --project-ref eyafgfuxvarbpkhjkuxq
```

### **Step 6: Test the Fix**
1. Visit `http://localhost:5173/pricing`
2. Click "Upgrade to Basic"
3. Verify Stripe checkout shows $2.99/month

---

## 🔍 **Troubleshooting**

### **Issue: "supabase command not found"**
**Solution:**
- Restart your terminal/PowerShell
- Check if Supabase is in your PATH
- Try running the full path to the executable

### **Issue: Permission Denied**
**Solution:**
- Run PowerShell as Administrator
- Set execution policy: `Set-ExecutionPolicy RemoteSigned`

### **Issue: Scoop Installation Fails**
**Solution:**
- Check internet connection
- Try running PowerShell as Administrator
- Use Option 2 (Direct Download) instead

---

## 📋 **Quick Commands Reference**

### **Essential Supabase CLI Commands**
```bash
# Check version
supabase --version

# Login
supabase login

# Link project
supabase link --project-ref eyafgfuxvarbpkhjkuxq

# Deploy function
supabase functions deploy create-subscription

# Set secrets
supabase secrets set KEY=value

# List functions
supabase functions list

# View function logs
supabase functions logs create-subscription
```

---

## 🎯 **Current Priority**

### **Immediate Goal**
Deploy the Edge Function fix to resolve the Basic tier subscription issue:

**Current Problem:**
- Basic tier button creates Pro subscription ($4.99 instead of $2.99)
- Causes billing confusion and customer issues

**The Fix:**
- Edge Function needs fallback price ID for Basic tier
- Code is ready, just needs deployment

### **Expected Timeline**
- **Install CLI**: 5-10 minutes
- **Deploy fix**: 2-3 minutes
- **Test**: 2-3 minutes
- **Total**: ~15 minutes to resolve the issue

---

## 🚨 **Alternative: Manual Dashboard Method**

### **If CLI installation fails, use Supabase Dashboard:**

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Select project: Affiliate-Gate (eyafgfuxvarbpkhjkuxq)**
3. **Navigate to Edge Functions**
4. **Edit `create-subscription` function**
5. **Replace line 126-129 with:**
   ```typescript
   const priceId = planType === 'basic'
     ? (Deno.env.get('STRIPE_PRICE_BASIC_MONTHLY') || 'price_1SB68VDGBbR8XeGs5EqAmqyu')
     : Deno.env.get('STRIPE_PRICE_PRO_MONTHLY')
   ```
6. **Deploy the function**

---

## ✅ **Success Indicators**

### **CLI Installation Success:**
- `supabase --version` returns version number
- `supabase login` opens browser authentication
- Commands run without "command not found" errors

### **Fix Deployment Success:**
- Function deploys without errors
- Basic tier creates $2.99 Stripe checkout
- Browser console shows correct price ID

**Let's get the CLI installed and fix this billing issue!** 🚀
