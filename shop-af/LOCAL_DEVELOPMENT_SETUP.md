# Shop AF - Local Development Setup Guide

## 🖥️ System Requirements

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm** or **pnpm**: Package manager (pnpm recommended)
- **Git**: For version control
- **Web Browser**: Chrome, Firefox, Safari, or Edge
- **Text Editor**: VS Code recommended

### Recommended System Specs
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux

## 📁 Project Structure

```
shop-af/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Route pages
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and configurations
│   ├── context/       # React context providers
│   └── App.tsx        # Main app component
├── public/            # Static assets
├── dist/              # Build output
├── package.json       # Dependencies and scripts
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # Tailwind CSS config
└── tsconfig.json      # TypeScript configuration
```

## 🚀 Installation Steps

### 1. Extract and Navigate
```bash
# Extract the shop-af folder to your desired location
cd path/to/shop-af
```

### 2. Install Node.js Dependencies
```bash
# Using pnpm (recommended)
npm install -g pnpm
pnpm install

# OR using npm
npm install
```

### 3. Start Development Server
```bash
# Using pnpm
pnpm dev

# OR using npm
npm run dev
```

### 4. Open in Browser
- Development server will start at: `http://localhost:5173`
- The browser should automatically open to the application

## ⚙️ Environment Configuration

### Environment Variables Setup
The application now uses environment variables for sensitive configuration:

1. **Copy the example environment file**:
```bash
cp .env.example .env
```

2. **Update the `.env` file with your actual values**:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
VITE_STRIPE_PRICE_PRO_MONTHLY=your_stripe_price_id_here
```

**Note**: The included `.env` file contains working production keys for immediate testing, but you should replace them with your own keys for production use.

### Backend Services
The application connects to pre-configured backend services:
- **Supabase**: Database, authentication, and file storage
- **Stripe**: Payment processing and subscriptions

## 📦 Technology Stack

### Core Framework
- **React 18.3.1**: Frontend framework
- **TypeScript**: Type safety
- **Vite 6.0.1**: Build tool and dev server
- **React Router 6**: Client-side routing

### UI Components
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Conditional CSS classes

### Backend Integration
- **Supabase Client**: Database and auth integration
- **Stripe.js**: Payment processing
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 🎯 Available Scripts

```bash
# Start development server
pnpm dev          # Runs on http://localhost:5173

# Build for production
pnpm build        # Creates optimized build in dist/

# Preview production build
pnpm preview      # Serves the dist/ folder

# Run linting
pnpm lint         # Checks code quality
```

## 🔧 Development Features

### Hot Module Replacement (HMR)
- Changes to React components update instantly
- CSS changes apply immediately without page refresh
- TypeScript compilation happens in real-time

### TypeScript Support
- Full TypeScript integration
- Type checking during development
- IntelliSense and auto-completion

### Tailwind CSS
- Utility-first CSS framework
- Custom theme configuration
- Built-in responsive design

## 🌐 Local Testing

### User Features to Test
1. **Authentication**: Sign up/login functionality
2. **Profile Creation**: Create and customize user profiles
3. **Product Management**: Add products with images
4. **Gradient Customization**: Test color picker and backgrounds
5. **Responsive Design**: Test on different screen sizes

### Admin Features to Test
1. **Admin Login**: Access admin dashboard at `/admin`
2. **User Management**: View all registered users, grant/revoke admin privileges
3. **Whitelist System**: Add/remove emails for automatic Pro access
4. **Pro Access**: Grant Pro access to individual users

### Payment Testing
- Stripe is configured for production
- Test mode can be enabled by using Stripe test keys

## 📱 Mobile Development

### Responsive Testing
```bash
# Test different screen sizes
# Desktop: Default browser window
# Tablet: Resize to ~768px width
# Mobile: Resize to ~375px width
```

### Browser DevTools
- Use browser developer tools (F12)
- Toggle device toolbar for mobile simulation
- Test touch interactions

## 🐛 Troubleshooting

### Common Issues

**1. Node.js Version Error**
```bash
# Check Node.js version
node --version
# Should be 18.0.0 or higher
```

**2. Port Already in Use**
```bash
# If port 5173 is busy, Vite will use next available port
# Check terminal output for actual port number
```

**3. Package Installation Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml  # or package-lock.json
pnpm install
```

**4. TypeScript Errors**
```bash
# Restart TypeScript service in VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Performance Tips
- Use pnpm instead of npm for faster installs
- Close unnecessary browser tabs
- Use browser dev tools to monitor performance
- Keep dependencies updated

## 🔄 Development Workflow

### Recommended Process
1. **Start Development Server**: `pnpm dev`
2. **Open Browser**: Navigate to `http://localhost:5173`
3. **Make Changes**: Edit files in `src/` directory
4. **View Changes**: Browser updates automatically
5. **Test Features**: Use the application as an end user
6. **Build Production**: `pnpm build` when ready

### File Organization
- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route-specific pages in `src/pages/`
- **Hooks**: Custom React hooks in `src/hooks/`
- **Utils**: Helper functions in `src/lib/`
- **Styles**: Global styles in `src/index.css`

## 🔒 Security Notes

### API Keys
- Production API keys are included in `.env` for immediate functionality
- For production deployment, use your own API keys in `.env`
- Never commit sensitive keys to version control
- The `.env` file is already in `.gitignore` for security

### CORS Configuration
- Supabase is configured to allow localhost origins
- No additional CORS setup required for local development

## 📞 Support

### Resources
- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Supabase Docs**: https://supabase.com/docs

### Quick Start Summary
```bash
cd shop-af
pnpm install
pnpm dev
# Open http://localhost:5173 in browser
```

**Your Shop AF platform is now ready for local development!** 🎉
