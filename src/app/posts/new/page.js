// src/app/posts/new/page.js
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

  // --- Protection ---
  // Redirect if not authenticated or during loading state
  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (status === 'unauthenticated') {
      // Redirect to login page if not logged in
      router.push('/login?callbackUrl=/posts/new'); // Redirect back here after login
    }
  }, [status, router]);
  // --- End Protection ---


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);

    if (!title) {
      setError('Title is required.');
      setIsLoading(false);
      return;
    }
    // Add other client-side validation if needed (e.g., content length)

    try {
      console.log('Submitting new post:', { title, content, published });

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, published }),
      });

      const data = await res.json(); // Get response data (new post or error)
      console.log('API Response:', data);

      setIsLoading(false);

      if (!res.ok) {
        // Use message from API response if available
        setError(data.message || `Error: ${res.status} ${res.statusText}`);
      } else {
        // Post created successfully
        console.log('Post created successfully:', data);
        // Redirect to the newly created post's page (we need its ID from response)
        // or redirect to the main blog page
        // Assuming the API returns the created post object including its id:
        if (data?.id) {
             router.push(`/blog/${data.id}`); // Go to the new post's page
        } else {
             router.push('/blog'); // Fallback to blog list
        }

      }
    } catch (err) {
      setIsLoading(false);
      console.error('Failed to create post:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Render nothing or a loading indicator while checking session
  if (status === 'loading' || status === 'unauthenticated') {
    return (
        <div className="text-center py-10">
            <p>Loading session or redirecting...</p>
            {/* Optional: Add a spinner */}
        </div>
    );
  }

  // Render the form once authenticated
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Post</h1>
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            disabled={isLoading}
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publish this post
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || status !== 'authenticated'} // Disable if loading or not logged in
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}