# 🎨 Logo Setup Guide

## 🚨 Current Status
The navbar is currently showing the fallback text logo because the `sitetitle.png` image file is missing.

## ✅ How to Add Your Logo

### Step 1: Prepare Your Logo Image
1. **File name**: Must be exactly `sitetitle.png`
2. **Format**: PNG with transparent background (recommended)
3. **Size**: Recommended height: 32-64px (width will auto-scale)
4. **Quality**: High resolution for crisp display

### Step 2: Add Logo to Project
1. Save your logo image as `sitetitle.png`
2. Place it in the `public/` folder:
   ```
   public/
   ├── sitetitle.png  ← Your logo goes here
   ├── _redirects
   └── .htaccess
   ```

### Step 3: Rebuild and Deploy
```bash
npm run build
```

## 🔧 How the Logo System Works

### Automatic Fallback
The navbar now includes smart fallback logic:

```jsx
{!imageError ? (
  <img 
    src="/sitetitle.png" 
    alt="AlleyLink" 
    className="h-8 w-auto"
    onError={() => setImageError(true)}
  />
) : (
  // Fallback to original text logo
  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    AlleyLink
  </span>
)}
```

### What Happens:
1. **Logo exists**: Shows your `sitetitle.png` image
2. **Logo missing/broken**: Automatically falls back to "AlleyLink" text
3. **No broken image icons**: Clean user experience

## 📍 Logo Locations Updated

### ✅ Navbar (Primary)
- **File**: `src/components/Navbar.tsx`
- **Path**: `/sitetitle.png`
- **Size**: `h-8 w-auto` (32px height, auto width)
- **Fallback**: Text logo with gradient

### ✅ Footer
- **File**: `src/pages/LandingPage.tsx`
- **Path**: `/sitetitle.png`
- **Size**: `h-8 w-auto`
- **Style**: White filter for dark background
- **Fallback**: Text logo

### ✅ Favicon
- **File**: `index.html`
- **Path**: `/sitetitle.png`
- **Purpose**: Browser tab icon

## 🎯 Logo Specifications

### Recommended Dimensions:
- **Height**: 32-64px
- **Width**: Auto (maintains aspect ratio)
- **Format**: PNG with transparency
- **Background**: Transparent or white

### Design Tips:
- Keep it simple and readable at small sizes
- Ensure good contrast against light backgrounds
- Test at different screen sizes

## 🧪 Testing Your Logo

### After adding your logo:
1. **Development**: Run `npm run dev` and check navbar
2. **Production**: Run `npm run build` and check dist folder
3. **Deployment**: Verify logo appears on live site

### Troubleshooting:
- **Broken image**: Check file name is exactly `sitetitle.png`
- **Wrong size**: Adjust image dimensions
- **Not showing**: Clear browser cache and refresh

## 📁 File Structure
```
project/
├── public/
│   ├── sitetitle.png     ← ADD YOUR LOGO HERE
│   ├── _redirects
│   └── .htaccess
├── src/
│   ├── components/
│   │   └── Navbar.tsx    ← Logo implementation
│   └── pages/
│       └── LandingPage.tsx ← Footer logo
└── index.html            ← Favicon reference
```

## 🚀 Quick Setup Commands

```bash
# 1. Add your logo to public folder
cp your-logo.png public/sitetitle.png

# 2. Rebuild project
npm run build

# 3. Test locally
npm run preview

# 4. Deploy
# Upload dist/ folder to your hosting platform
```

## ✨ Expected Result

### With Logo:
- Clean image-based branding
- Professional appearance
- Consistent across all pages

### Without Logo (Fallback):
- Original "AlleyLink" text with gradient
- No broken images
- Fully functional navigation

Your logo will automatically appear once you add the `sitetitle.png` file to the `public/` folder!
