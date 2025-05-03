// src/components/Navbar.js
'use client'; // This component uses hooks, so it must be a Client Component

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  // useSession hook provides session data and status
  const { data: session, status } = useSession();
  // status can be 'loading', 'authenticated', or 'unauthenticated'

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50"> {/* Added sticky positioning */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Responsive padding */}
        <div className="flex justify-between items-center h-16"> {/* Fixed height */}

          {/* Left side: Site Title/Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800">
              BlogPlatform
            </Link>
          </div>

          {/* Right side: Links/User Info */}
          <div className="flex items-center space-x-4"> {/* Added spacing */}

            {/* Always show link to Posts (optional) */}
            <Link href="/blog" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Posts
            </Link>

            {/* Loading State */}
            {status === 'loading' && (
              <span className="text-gray-500 text-sm animate-pulse">Loading...</span>
            )}

            {/* Unauthenticated State */}
            {status === 'unauthenticated' && (
              <>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </>
            )}

            {/* Authenticated State */}
            {status === 'authenticated' && session?.user && (
              <>
                {/* Link to Create Post Page (we'll create this page later) */}
                <Link href="/posts/new" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  New Post
                </Link>

                {/* Display User Name/Email */}
                <span className="text-gray-700 text-sm font-medium hidden sm:block"> {/* Hide on small screens */}
                  {session.user.name || session.user.email}
                </span>

                {/* Logout Button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })} // Sign out and redirect to homepage
                  className="bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}