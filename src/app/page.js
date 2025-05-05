'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex items-start pt-8 px-4 sm:pt-12">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 mx-auto">

        <div className="h-2 bg-blue-400 w-full"></div>

        <div className="p-6 sm:p-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-400">BlogHandler</span>
          </h1>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Your all-in-one platform to explore insightful blog posts and share your own thoughts with the world.
          </p>

          <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 mb-8">
            <p className="text-blue-500 font-medium">
              Use the navigation bar to browse through posts or start writing your own.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link
              href="/blog"
              className="px-6 py-3 bg-blue-400 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
            >
              Explore Posts
            </Link>
            <Link
              href="/posts/new"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}