'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left side: Site Title/Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-black hover:text-blue-400 transition-colors">
              <span className="text-blue-400">Blog</span> Handler
            </Link>
          </div>

          {/* Right side: Links/User Info */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Always show link to Posts */}
            <Link
              href="/blog"
              className="text-gray-700 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Posts
            </Link>

            {/* Loading State */}
            {status === 'loading' && (
              <div className="animate-pulse flex space-x-2">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            )}

            {/* Unauthenticated State */}
            {status === 'unauthenticated' && (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-400 text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            )}

            {/* Authenticated State */}
            {status === 'authenticated' && session?.user && (
              <>
                <Link
                  href="/posts/new"
                  className="text-gray-700 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  New Post
                </Link>

                {/* User Profile with Avatar */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium hidden md:block">
                    {session.user.name || session.user.email}
                  </span>
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
                      {(session.user.name || session.user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-700 hover:text-white hover:bg-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-gray-300"
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