/**
 * User Storage for Authentication
 * 
 * This module handles storing user data on sign-in.
 * Currently uses a simple file-based approach for demo purposes.
 * 
 * TODO: Replace with proper database (Postgres, MongoDB, etc.)
 */

interface UserData {
  email: string;
  name?: string;
  image?: string;
  provider: string;
  providerAccountId?: string;
}

interface StoredUser extends UserData {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

// In production, this would be a database client
// For now, we log and could integrate with Vercel KV, Postgres, etc.

/**
 * Store user data on sign-in
 * Called every time a user signs in
 */
export async function storeUserOnSignIn(userData: UserData): Promise<StoredUser> {
  const now = new Date().toISOString();
  
  const user: StoredUser = {
    id: `user_${Buffer.from(userData.email).toString('base64url')}`,
    email: userData.email,
    name: userData.name,
    image: userData.image,
    provider: userData.provider,
    providerAccountId: userData.providerAccountId,
    createdAt: now, // Would be preserved if user exists
    updatedAt: now,
    lastLoginAt: now,
  };
  
  // Log for debugging/verification
  console.log('[Auth] User signed in:', {
    email: user.email,
    name: user.name,
    provider: user.provider,
    timestamp: now,
  });
  
  // Store in Vercel KV if available
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const response = await fetch(
        `${process.env.KV_REST_API_URL}/set/user:${encodeURIComponent(user.email)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        }
      );
      
      if (!response.ok) {
        console.error('[Auth] Failed to store in KV:', await response.text());
      } else {
        console.log('[Auth] User stored in Vercel KV');
      }
    } catch (error) {
      console.error('[Auth] KV storage error:', error);
    }
  }
  
  return user;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  // Try Vercel KV first
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const response = await fetch(
        `${process.env.KV_REST_API_URL}/get/user:${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.result ? JSON.parse(data.result) : null;
      }
    } catch (error) {
      console.error('[Auth] KV fetch error:', error);
    }
  }
  
  return null;
}
