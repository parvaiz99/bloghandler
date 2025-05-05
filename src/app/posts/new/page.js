'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/posts/new');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!title) {
      setError('Title is required.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, published }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setError(data.message || `Error: ${res.status} ${res.statusText}`);
      } else {
        if (data?.id) {
          router.push(`/blog/${data.id}`);
        } else {
          router.push('/blog');
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="text-center py-10">
        <p>Loading session or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all placeholder-gray-400"
            placeholder="Your Post Title"
            disabled={isLoading}
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all placeholder-gray-400"
            placeholder="Write your post content here..."
            disabled={isLoading}
          ></textarea>
        </div>

        {/* Published Checkbox */}
        <div className="flex items-center">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            disabled={isLoading}
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publish this post
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || status !== 'authenticated'}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}