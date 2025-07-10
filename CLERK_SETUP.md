# Clerk Authentication Setup Guide

## 🚀 Quick Setup

### 1. Create Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys

1. In your Clerk dashboard, go to **API Keys**
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Update Environment Variables

1. Open `.env.local` in your project
2. Replace the placeholder values with your actual Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
CLERK_SECRET_KEY=sk_test_your_actual_secret_key
```

### 4. Configure Authentication Settings

1. In your Clerk dashboard, go to **User & Authentication**
2. Configure your preferred sign-in methods (Email, Google, etc.)
3. Set up your domain in **Domains & URLs**

### 5. Test the Connection

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. You should be redirected to the sign-in page
4. Create an account and test the authentication flow

## 🔐 Authentication Flow

The app is configured with the following authentication flow:

- **Sign In**: `/auth/sign-in`
- **Sign Up**: `/auth/sign-up`
- **Redirect after auth**: `/dashboard/overview`
- **Protected routes**: All `/dashboard/*` routes

## 🛠️ Features Included

- **User Management**: Profile, settings, and account management
- **Role-based Access**: Client vs Admin roles
- **Protected Routes**: Middleware protection for dashboard
- **User Avatar**: Profile pictures and user info display
- **Sign Out**: Proper logout functionality

## 🔄 Alternative: Switch to Supabase Auth

If you prefer to use Supabase Auth instead of Clerk:

1. **Remove Clerk dependencies**:
   ```bash
   npm uninstall @clerk/nextjs @clerk/themes
   ```

2. **Install Supabase Auth**:
   ```bash
   npm install @supabase/auth-helpers-nextjs
   ```

3. **Update authentication components** to use Supabase Auth
4. **Remove Clerk environment variables** from `.env.local`

## 🐛 Troubleshooting

### Common Issues:

1. **"Publishable key not valid"** - Check your Clerk API keys
2. **"Invalid domain"** - Add your domain to Clerk allowed origins
3. **"Redirect loop"** - Check your redirect URLs in `.env.local`

### Debug Mode:

Add this to see detailed Clerk logs:

```typescript
// In your ClerkProvider
<ClerkProvider
  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
  debug={true}
>
```

## 📚 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js + Clerk Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Authentication Best Practices](https://clerk.com/docs/security)

## 🎯 Next Steps

After setting up Clerk:

1. **Test authentication flow** - sign up, sign in, sign out
2. **Configure user roles** - set up client vs admin permissions
3. **Customize UI** - modify sign-in/sign-up forms if needed
4. **Add social logins** - Google, GitHub, etc.
5. **Set up webhooks** - for user events if needed 