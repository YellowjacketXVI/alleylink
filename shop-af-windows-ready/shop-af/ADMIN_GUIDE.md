# Admin Guide - Shop AF

This guide explains how to manage whitelisted accounts and admin features in Shop AF.

## Admin Access

### Becoming an Admin
1. **Database Access Required**: Admin privileges must be granted directly in the database
2. **Set is_admin flag**: Update the `profiles` table to set `is_admin = true` for your user
3. **Alternative**: Ask an existing admin to grant you admin privileges through the admin dashboard

### Accessing Admin Dashboard
- **URL**: `/admin`
- **Navigation**: Click "Admin" in the navbar (only visible to admin users)
- **Requirements**: Must be logged in with admin privileges

## Whitelist Management

### What is the Whitelist?
The whitelist is a system that automatically grants Pro access to users with specific email addresses when they sign up.

### Adding Emails to Whitelist
1. Go to the Admin Dashboard (`/admin`)
2. Click on the "Whitelist" tab
3. Enter the email address in the input field
4. Click "Add" to add the email to the whitelist

### How Whitelist Works
- When a user signs up with a whitelisted email, they automatically get:
  - `plan_type: 'pro'`
  - `subscription_status: 'active'`
  - No payment required
- The `create-subscription` Supabase Edge Function checks the whitelist before creating a Stripe checkout session

### Removing from Whitelist
1. Go to the Admin Dashboard (`/admin`)
2. Click on the "Whitelist" tab
3. Find the email in the table
4. Click "Remove" to remove the email from the whitelist

## User Management

### Viewing All Users
- The "Users" tab shows all registered users with:
  - Username and display name
  - Current plan type (Free/Pro/Unlimited)
  - Product count
  - Join date
  - Admin status

### Granting Admin Privileges
1. Find the user in the Users table
2. Click "Make Admin" to grant admin privileges
3. Click "Remove Admin" to revoke admin privileges

### Granting Pro Access
1. Find a Free plan user in the Users table
2. Click "Grant Pro" to immediately upgrade them to Pro
3. This bypasses payment and gives them full Pro features

## Database Tables

### Whitelist Table (`whitelist`)
```sql
CREATE TABLE whitelist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  granted_by_admin TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Profiles Table (`profiles`)
Key fields for admin management:
- `is_admin`: Boolean flag for admin privileges
- `plan_type`: 'free', 'pro', or 'unlimited'
- `subscription_status`: 'free', 'active', or 'inactive'

## Security Considerations

### Environment Variables
All sensitive information has been moved to environment variables:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `VITE_STRIPE_PRICE_PRO_MONTHLY`: Stripe price ID for Pro plan

### Best Practices
1. **Never commit `.env` files** to version control
2. **Use different keys** for development and production
3. **Regularly rotate** API keys and secrets
4. **Limit admin access** to trusted users only
5. **Monitor whitelist usage** to prevent abuse

## Troubleshooting

### Admin Dashboard Not Accessible
- Check if user has `is_admin = true` in the database
- Verify user is logged in
- Check browser console for errors

### Whitelist Not Working
- Verify the `create-subscription` Edge Function is deployed
- Check Supabase logs for function errors
- Ensure email addresses are exact matches (case-insensitive)

### Environment Variables Not Loading
- Ensure `.env` file exists in project root
- Check variable names start with `VITE_`
- Restart development server after changing `.env`

## Support

For technical issues:
1. Check browser console for errors
2. Review Supabase logs
3. Verify database table structure
4. Test with a known working email address

## Quick Setup Checklist

- [ ] Create `.env` file with required variables
- [ ] Set up admin user in database (`is_admin = true`)
- [ ] Test admin dashboard access
- [ ] Add test email to whitelist
- [ ] Verify whitelist functionality with test signup
- [ ] Document admin users and procedures
