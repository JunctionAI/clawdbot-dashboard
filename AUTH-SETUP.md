# Google OAuth Setup for Clawdbot Dashboard

## Environment Variables Required

Add these to your Vercel project settings (Settings → Environment Variables):

### Required Variables

```env
# NextAuth.js Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Optional Variables (for user storage)

```env
# Vercel KV (for storing user data)
KV_REST_API_URL=https://your-kv-instance.kv.vercel-storage.com
KV_REST_API_TOKEN=your-kv-token
```

---

## Step 1: Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

---

## Step 2: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: Clawdbot
   - Support email: your email
   - Authorized domains: your-domain.vercel.app
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Clawdbot Dashboard
   - Authorized JavaScript origins:
     - `https://your-domain.vercel.app`
     - `http://localhost:3000` (for development)
   - Authorized redirect URIs:
     - `https://your-domain.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (for development)
7. Copy the **Client ID** and **Client Secret**

---

## Step 3: Add to Vercel

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable for Production (and Preview/Development as needed)

| Variable | Environment | Notes |
|----------|-------------|-------|
| NEXTAUTH_URL | Production | Your production URL |
| NEXTAUTH_SECRET | All | Same across all environments |
| GOOGLE_CLIENT_ID | All | From Google Console |
| GOOGLE_CLIENT_SECRET | All | From Google Console |

---

## Step 4: Local Development

Create a `.env.local` file (not committed to git):

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## Protected Routes

The following routes require authentication:
- `/dashboard/*`
- `/chat/*`
- `/workspace/*`
- `/settings/*`

Unauthenticated users are redirected to `/setup` to sign in.

---

## How It Works

1. User visits protected route → Redirected to `/setup`
2. User clicks "Continue with Google"
3. Google OAuth flow completes
4. User email is stored in database (if KV configured)
5. User is redirected to their intended destination (or `/dashboard`)

---

## User Menu Component

Add the `UserMenu` component to your header/navbar:

```tsx
import { UserMenu } from '@/components/auth';

function Header() {
  return (
    <header>
      {/* ... other header content ... */}
      <UserMenu />
    </header>
  );
}
```

---

## Session Access

Use the `useSession` hook from `next-auth/react`:

```tsx
'use client';
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <Loading />;
  if (!session) return <SignInPrompt />;
  
  return <div>Hello, {session.user.name}!</div>;
}
```

---

## Server-Side Session

For server components or API routes:

```tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In a server component
async function ServerComponent() {
  const session = await getServerSession(authOptions);
  // ...
}

// In an API route
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}
```

---

## Troubleshooting

### "CSRF token mismatch" error
- Ensure NEXTAUTH_URL matches your actual domain exactly
- Check that cookies aren't being blocked

### "Invalid redirect_uri" from Google
- Add the exact callback URL to Google Console
- Format: `https://your-domain.vercel.app/api/auth/callback/google`

### Session not persisting
- Check NEXTAUTH_SECRET is set and consistent
- Verify cookies are enabled in browser

---

## Security Notes

- Never commit `.env.local` to git
- Rotate secrets periodically
- Use different Google OAuth apps for production and development
- Enable 2FA on your Google Cloud account
