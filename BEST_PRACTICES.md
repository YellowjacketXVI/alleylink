# 📘 AlleyLink Project Best Practices

## 1. Project Purpose

**AlleyLink** is a React-based SaaS platform that enables users to create personalized affiliate marketing profiles. Users can showcase products with affiliate links, customize their profile appearance, and track analytics. The platform integrates with **Supabase** for backend services, **Stripe** for payments, and supports multiple subscription tiers (free, basic, pro, unlimited) with different feature limits.

---

## 2. Project Structure

```
shop-af/                    # Main React application
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route-based page components
│   ├── context/           # React context providers (Auth, Error)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities, configurations, and services
│   └── App.tsx            # Main app component with routing
├── supabase/
│   └── functions/         # Edge functions for backend logic
├── public/                # Static assets
└── database/              # SQL scripts and migrations
```

### Key Directory Roles

- **`components/`**: Shared UI components (ErrorBoundary, LoadingSpinner, etc.)
- **`pages/`**: Route-specific components using lazy loading
- **`context/`**: Global state management (AuthContext, ErrorContext)
- **`lib/`**: Core utilities (supabase client, stripe config, validation utils)
- **`supabase/functions/`**: Serverless functions for webhooks and analytics

---

## 3. Test Strategy

### Testing Framework & Organization

- **Framework**: Vitest for unit testing
- **Test Location**: Tests are co-located with source files using `.test.ts` suffix
- **Testing Philosophy**: Focus on utility functions and business logic validation
- **Coverage Target**: Minimum 80% code coverage for utility functions and business logic
- **Mocking**: Use Vitest's built-in mocking capabilities for external dependencies

### Test Types & Coverage

#### Unit Testing
- Utility functions (e.g., `utils.test.ts`)
- Validation logic testing (username validation, email validation)
- Business rule testing (plan limits, subscription logic)
- Custom hooks testing

#### Component Testing
- Component rendering and props handling
- User interaction testing
- Error state handling
- Loading state behavior

#### Integration Testing
- API integration with Supabase
- Authentication flow testing
- Payment processing workflows
- End-to-end user journeys

### Coverage Requirements

```bash
# Run tests with coverage
pnpm test --coverage

# Coverage thresholds
- Functions: 80%
- Branches: 75%
- Lines: 80%
- Statements: 80%
```

---

## 4. Code Style & Standards

### TypeScript Usage

- **Strict typing**: All components and functions use explicit TypeScript types
- **Interface definitions**: Comprehensive interfaces for all data models (Profile, Product, Subscription, etc.)
- **Type safety**: Leverage TypeScript for compile-time error detection
- **Import/Export**: Use ES6 modules with explicit imports

### Naming Conventions

- **Files**: PascalCase for components (`ErrorBoundary.tsx`), camelCase for utilities (`utils.ts`)
- **Components**: PascalCase React components with descriptive names
- **Functions**: camelCase with verb-noun pattern (`validateUsername`, `isValidEmail`)
- **Constants**: UPPER_SNAKE_CASE for configuration constants (`USERNAME_RULES`, `PLAN_LIMITS`)
- **Variables**: camelCase for local variables and props

### Component Patterns

- **Functional components**: Prefer function components with hooks over class components
- **Props interfaces**: Define explicit interfaces for component props
- **Error boundaries**: Use class components only for ErrorBoundary pattern
- **Lazy loading**: Use React.lazy() for route-based code splitting

### Error Handling Patterns

#### Standard Error Response Format
```typescript
interface ErrorResponse {
  isValid: boolean;
  error?: string;
  code?: string;
}
```

#### Async Error Handling Pattern
```typescript
const handleAsyncOperation = async () => {
  try {
    setLoading(true);
    const result = await apiCall();
    setData(result);
  } catch (error) {
    console.error('Operation failed:', error);
    setError(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    setLoading(false);
  }
};
```

#### Component Error Boundaries
- Wrap application in ErrorBoundary for graceful error handling
- Provide fallback UI for component errors
- Log errors for debugging while showing user-friendly messages

---

## 5. Security Best Practices

### Authentication & Authorization

- **JWT Handling**: Never store sensitive tokens in localStorage; use httpOnly cookies when possible
- **Role-based Access**: Implement proper role checking on both client and server sides
- **Session Management**: Implement proper session timeout and refresh mechanisms

### Data Protection

- **Input Validation**: Validate all user inputs on both client and server sides
- **SQL Injection Prevention**: Use parameterized queries and Supabase's built-in protections
- **XSS Prevention**: Sanitize user-generated content before rendering

### API Security

```typescript
// Example: Secure API call pattern
const secureApiCall = async (endpoint: string, data: any) => {
  try {
    const { data: result, error } = await supabase
      .from(endpoint)
      .select('*')
      .eq('user_id', user.id); // Always filter by user context
    
    if (error) throw error;
    return result;
  } catch (error) {
    // Log error securely without exposing sensitive data
    console.error('API call failed:', { endpoint, error: error.message });
    throw new Error('Operation failed');
  }
};
```

### Environment Variables

- **Sensitive Data**: Never commit API keys or secrets to version control
- **Environment Separation**: Use different keys for development, staging, and production
- **Fallback Values**: Provide fallback values only for non-sensitive configuration

---

## 6. Performance Standards

### Bundle Size Targets

- **Initial Bundle**: < 250KB gzipped
- **Route Chunks**: < 100KB gzipped per route
- **Vendor Chunks**: < 500KB gzipped

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Performance Monitoring

```bash
# Bundle analysis
pnpm build --analyze

# Performance testing
pnpm lighthouse

# Core Web Vitals monitoring
pnpm web-vitals
```

### Optimization Strategies

#### Code Splitting
```typescript
// Route-based splitting
const LazyComponent = lazy(() => import('./components/HeavyComponent'));

// Component-based splitting
const LazyModal = lazy(() => import('./components/Modal'));
```

#### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading for images
- Optimize image sizes for different screen densities

#### Caching Strategies
- Leverage browser caching for static assets
- Implement service worker for offline functionality
- Use Supabase caching for frequently accessed data

---

## 7. Accessibility Guidelines

### WCAG 2.1 AA Compliance

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Implement proper focus management
- Provide skip links for main content areas

#### Screen Reader Support
```typescript
// Example: Proper ARIA labels
<button
  aria-label="Delete product"
  aria-describedby="delete-help-text"
  onClick={handleDelete}
>
  <TrashIcon />
</button>
<div id="delete-help-text" className="sr-only">
  This action cannot be undone
</div>
```

#### Color and Contrast
- Maintain minimum 4.5:1 contrast ratio for normal text
- Maintain minimum 3:1 contrast ratio for large text
- Don't rely solely on color to convey information

#### Responsive Design
- Support zoom up to 200% without horizontal scrolling
- Ensure touch targets are at least 44x44 pixels
- Test with various screen readers and assistive technologies

---

## 8. API Integration Patterns

### Supabase Integration

#### Error Handling Pattern
```typescript
const handleSupabaseOperation = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Database operation failed: ${error.message}`);
  }

  return data;
};
```

#### Retry Strategy
```typescript
const withRetry = async (operation: () => Promise<any>, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};
```

### Stripe Integration

#### Payment Processing Pattern
```typescript
const processPayment = async (planType: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: { planType }
    });

    if (error) throw new Error(`Payment processing failed: ${error.message}`);
    
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }
  } catch (error) {
    console.error('Payment error:', error);
    // Show user-friendly error message
    setError('Payment processing failed. Please try again.');
  }
};
```

---

## 9. Code Review Guidelines

### Review Checklist

#### Functionality
- [ ] Code meets requirements and acceptance criteria
- [ ] All edge cases are handled appropriately
- [ ] Error handling is implemented correctly
- [ ] Loading states are properly managed

#### Code Quality
- [ ] TypeScript types are properly defined
- [ ] Naming conventions are followed
- [ ] Code is readable and well-documented
- [ ] No code duplication or unnecessary complexity

#### Security
- [ ] Input validation is implemented
- [ ] No sensitive data is exposed
- [ ] Authentication/authorization is properly handled
- [ ] Environment variables are used for configuration

#### Performance
- [ ] No unnecessary re-renders or computations
- [ ] Images and assets are optimized
- [ ] Bundle size impact is considered
- [ ] Accessibility requirements are met

### Review Process

1. **Self-Review**: Author reviews their own code before requesting review
2. **Peer Review**: At least one team member reviews the code
3. **Testing**: All tests pass and new tests are added for new functionality
4. **Documentation**: README and best practices are updated if needed

---

## 10. Environment Setup & Troubleshooting

### Development Environment

#### Prerequisites
```bash
# Required versions
Node.js: >= 18.0.0
pnpm: >= 8.0.0
Git: >= 2.30.0
```

#### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd alleylink

# Install dependencies
pnpm install

# Copy environment variables
cp shop-af/.env.example shop-af/.env

# Start development server
cd shop-af
pnpm dev
```

#### Environment Variables Setup
```bash
# Required variables in shop-af/.env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_PRICE_BASIC_MONTHLY=your_basic_price_id
VITE_STRIPE_PRICE_PRO_MONTHLY=your_pro_price_id
```

### Common Issues & Solutions

#### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
pnpm dev --force
```

#### Database Connection Issues
```bash
# Verify Supabase configuration
pnpm test:connection

# Check environment variables
echo $VITE_SUPABASE_URL
```

#### Payment Integration Issues
```bash
# Test Stripe webhook locally
pnpm stripe:listen

# Verify webhook endpoints
pnpm test:webhooks
```

### Production Deployment

#### Pre-deployment Checklist
- [ ] All environment variables are configured
- [ ] Database migrations are applied
- [ ] Stripe webhooks are configured
- [ ] Performance tests pass
- [ ] Security scan passes

#### Deployment Commands
```bash
# Build for production
pnpm build

# Deploy to Vercel
pnpm deploy

# Deploy Supabase functions
pnpm supabase:deploy
```

## 5. Common Patterns

### Authentication & Authorization
- **Context-based auth**: Use AuthContext for global authentication state
- **Protected routes**: Wrap sensitive routes with ProtectedRoute component
- **Role-based access**: Support role-based routing (admin routes)
- **Auth redirects**: Redirect authenticated users away from login/signup pages

### Data Management
- **Supabase client**: Centralized client configuration in `lib/supabase.ts`
- **Type definitions**: Comprehensive TypeScript interfaces for all database models
- **Environment variables**: Use Vite environment variables with fallback values
- **Configuration constants**: Centralize plan limits and pricing in constants

### UI/UX Patterns
- **Loading states**: Use consistent loading spinners and suspense boundaries
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Theme support**: Support for light/dark themes using next-themes
- **Component library**: Extensive use of Radix UI components for accessibility

### Performance Optimization
- **Code splitting**: Lazy load all page components
- **Bundle optimization**: Use Vite for fast builds and hot reloading
- **Image optimization**: Proper image handling and optimization
- **Caching**: Leverage browser caching and Supabase caching strategies

## 6. Do's and Don'ts

### ✅ Do's
- Use TypeScript interfaces for all data structures
- Implement proper error boundaries and error handling
- Use lazy loading for route components to improve initial load time
- Validate user inputs with comprehensive validation functions
- Use environment variables with fallback values for configuration
- Implement proper loading states for async operations
- Use consistent naming conventions across the codebase
- Write unit tests for utility functions and business logic
- Use React Context for global state management
- Implement proper authentication and authorization patterns

### ❌ Don'ts
- Don't use class components except for ErrorBoundary
- Don't hardcode configuration values - use environment variables
- Don't skip TypeScript type definitions for props and data
- Don't ignore error handling in async operations
- Don't create deeply nested component hierarchies
- Don't use inline styles - prefer Tailwind CSS classes
- Don't skip validation for user inputs
- Don't expose sensitive data in client-side code
- Don't create components without proper prop interfaces
- Don't ignore accessibility best practices

## 7. Tools & Dependencies

### Core Framework
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Strict typing for better development experience
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing with lazy loading

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **next-themes**: Theme switching support

### Backend & Services
- **Supabase**: Backend-as-a-Service (database, auth, edge functions)
- **Stripe**: Payment processing and subscription management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

### Development Tools
- **ESLint**: Code linting with React-specific rules
- **Vitest**: Unit testing framework
- **PNPM**: Package manager for faster installs

### Project Setup
1. Install dependencies: `pnpm install`
2. Set up environment variables (copy `.env.example` to `.env`)
3. Configure Supabase project and database
4. Set up Stripe webhooks and products
5. Run development server: `pnpm dev`

## 8. Other Notes

### LLM Code Generation Guidelines
- Always use TypeScript with proper type definitions
- Follow the established component patterns (functional components with hooks)
- Use the existing utility functions in `lib/utils.ts` for common operations
- Implement proper error handling and loading states
- Use the established authentication patterns with AuthContext
- Follow the naming conventions and file organization structure
- Use Tailwind CSS for styling with the established design system
- Implement proper validation using the existing validation utilities
- Use the Supabase client configuration from `lib/supabase.ts`
- Follow the lazy loading pattern for new page components

### Special Considerations
- The project uses a monorepo structure with the main app in `shop-af/`
- Supabase edge functions are deployed separately and handle webhooks/analytics
- The application supports multiple subscription tiers with different feature limits
- Username validation has specific rules including reserved words and character restrictions
- The project uses client-side routing with proper 404 handling
- All external integrations (Stripe, Supabase) use environment variables with fallbacks
- The codebase emphasizes accessibility and responsive design principles