// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma'; // Ensure this path is correct
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log("Authorize function called with credentials:", credentials?.email); // Debug log

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password in authorize');
          throw new Error('Missing email or password.'); // Throw error for clearer feedback
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          console.log('No user found with email:', credentials.email);
          throw new Error('No user found with this email.');
        }

        // Check if user registered with credentials (has a password)
        if (!user.password) {
            console.log('User found but has no password set (maybe OAuth user)');
            throw new Error('This account does not have a password set.');
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          console.log('Invalid password for user:', credentials.email);
          throw new Error('Incorrect password.');
        }

        console.log('Credentials valid, user authorized:', user.email);
        // Return necessary user info (exclude password!)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    // Add other providers like Google, GitHub here if needed
  ],

  session: {
    strategy: 'jwt', // Use JWTs for session management
  },

  secret: process.env.NEXTAUTH_SECRET, // Essential for JWT encryption

  pages: {
    signIn: '/login', // Redirect to /login for sign-in
    error: '/auth/error', // Page to display auth errors (optional to create)
     // newUser: '/register' // Only relevant if using OAuth providers
  },

  callbacks: {
    // Add user ID to the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Add user ID to the session object from the JWT
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id; // Make user ID available in useSession()
      }
      return session;
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};

// Export the handlers for GET and POST requests
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };