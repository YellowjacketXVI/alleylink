# Shop AF - Affiliate Marketing Platform

A modern affiliate marketing platform built with React, TypeScript, and Supabase. Create beautiful storefronts, manage affiliate products, and track performance with advanced analytics.

## 🚀 Quick Start

See [LOCAL_DEVELOPMENT_SETUP.md](./LOCAL_DEVELOPMENT_SETUP.md) for detailed setup instructions.

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 📚 Documentation

- **[Local Development Setup](./LOCAL_DEVELOPMENT_SETUP.md)** - Complete setup guide
- **[Admin Guide](./ADMIN_GUIDE.md)** - Managing whitelisted accounts and admin features
- **[Quick Start](./START_LOCAL.md)** - Minimal setup instructions

## 🔧 Environment Configuration

The application uses environment variables for sensitive configuration. Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

## 🛡️ Admin Features

- **User Management**: View all users, grant/revoke admin privileges
- **Whitelist System**: Add emails for automatic Pro access
- **Pro Access**: Grant Pro features to individual users
- **Analytics**: Monitor platform usage and performance

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed admin instructions.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
