import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { storeUserOnSignIn } from './db';

/**
 * NextAuth Configuration
 * Google OAuth provider for Clawdbot dashboard
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  pages: {
    signIn: '/setup',
    error: '/setup',
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // Store user email in database on sign-in
      if (user.email) {
        try {
          await storeUserOnSignIn({
            email: user.email,
            name: user.name || undefined,
            image: user.image || undefined,
            provider: account?.provider || 'google',
            providerAccountId: account?.providerAccountId,
          });
        } catch (error) {
          console.error('Failed to store user on sign-in:', error);
          // Don't block sign-in if storage fails
        }
      }
      return true;
    },
    
    async session({ session, token }) {
      // Add user id to session
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    
    async redirect({ url, baseUrl }) {
      // If callback URL is specified and valid, use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // If coming from setup, go back to setup
      if (url.includes('/setup')) {
        return `${baseUrl}/setup`;
      }
      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};
