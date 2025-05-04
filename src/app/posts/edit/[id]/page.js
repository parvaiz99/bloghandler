// src/app/posts/edit/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation'; // Use useParams for client components
import Link from 'next/link'; // <-- ADD THIS LINE

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams(); // Hook to get route params in Client Components
  const postId = params?.id; // Get the post ID from params

  const { data: session, status } = useSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [originalAuthorId, setOriginalAuthorId] = useState(null); // To verify ownership
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start loading true to fetch data
  const [isSubmitting, setIsSubmitting] = useState(false); // For submit button state

  // --- Fetch existing post data ---
  useEffect(() => {
    if (!postId || status === 'loading') return; // Don't fetch if no ID or session loading

    if (status === 'unauthenticated') {
        // Redirect immediately if not logged in
        router.push(`/login?callbackUrl=/posts/edit/${postId}`);
        return; // Stop execution
    }

    // Only fetch if authenticated
    if (status === 'authenticated') {
      const fetchPostData = async () => {
        setIsLoading(true); // Indicate loading state
        setError('');
        try {
          console.log(`Edit Page: Fetching data for post ${postId}`);
          const res = await fetch(`/api/posts/${postId}`);

          if (!res.ok) {
            if (res.status === 404) {
              setError('Post not found.');
            } else {
              const data = await res.json().catch(() => ({})); // Try to get error msg
              setError(`Failed to fetch post: ${data.message || res.statusText}`);
            }
            setIsLoading(false);
            return; // Stop if fetch failed
          }

          const postData = await res.json();
          console.log('Edit Page: Received post data:', postData);

          // --- Authorization Check ---
          // Verify the logged-in user is the author BEFORE setting state
          if (session.user?.id !== postData.authorId) {
             console.error(`Edit Page: User ${session.user?.id} is not the author of post ${postId} (Author: ${postData.authorId})`);
             setError('You are not authorized to edit this post.');
             // Optionally redirect to blog page or show access denied message
             // router.push('/blog');
          } else {
             // Pre-fill form state if authorized
             setTitle(postData.title);
             setContent(postData.content || ''); // Handle null content
             setPublished(postData.published);
             setOriginalAuthorId(postData.authorId); // Store author ID for safety check on submit
          }
        } catch (err) {
          console.error('Edit Page: Error fetching post data:', err);
          setError('An error occurred while fetching the post data.');
        } finally {
          setIsLoading(false); // Stop loading state
        }
      };

      fetchPostData();
    }
  }, [postId, status, session, router]); // Dependencies for the effect
  // --- End Fetch existing post data ---


  // --- Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true); // Use separate state for submitting

    if (!title) {
      setError('Title is required.');
      setIsSubmitting(false);
      return;
    }

    // --- Double-check Authorization on Submit ---
    // Ensures user didn't tamper with state or wasn't logged out between load and submit
    if (!session || session.user?.id !== originalAuthorId) {
        setError('Authorization check failed. Unable to update post.');
        setIsSubmitting(false);
        return;
    }
    // --- End Authorization Check ---


    try {
      console.log(`Edit Page: Submitting update for post ${postId}`);
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, published }),
      });

      const data = await res.json(); // Get response data
      console.log('Edit Page: API PUT Response:', data);

      setIsSubmitting(false);

      if (!res.ok) {
        setError(data.message || `Error: ${res.status} ${res.statusText}`);
      } else {
        // Update successful
        console.log('Post updated successfully:', data);
        // Redirect back to the updated post's page
        router.push(`/blog/${postId}`);
        router.refresh(); // Optional: tell Next.js to refresh server components
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('Failed to update post:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };
  // --- End Handle Form Submission ---


  // --- Render Logic ---
  if (isLoading) {
    return <div className="text-center py-10">Loading post data...</div>;
  }

  if (error) {
     // Display error prominently if loading failed or unauthorized
     return (
         <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-4 text-red-600 text-center">Error</h1>
            <p className="text-center text-red-700 bg-red-100 p-4 rounded-md">{error}</p>
            <div className="mt-6 text-center">
                <Link href="/blog" className="text-indigo-600 hover:text-indigo-800">
                    ← Back to blog
                </Link>
            </div>
         </div>
     );
  }

  // Render form only if loading is complete and no critical error occurred
  // (Minor submit errors will show within the form)
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isSubmitting}
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isSubmitting}
          ></textarea>
        </div>

        {/* Published Checkbox */}
        <div className="flex items-center">
          <input
            id="published" name="published" type="checkbox" checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            disabled={isSubmitting}
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publish this post
          </label>
        </div>

        {/* Submit Error Message (if submit fails) */}
        {error && !isLoading && ( // Show submit errors only after loading is done
          <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || isLoading} // Disable if initially loading OR submitting
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
        </div>

        {/* Cancel Link */}
         <div className="text-center mt-4">
            <Link href={`/blog/${postId}`} className="text-sm text-gray-600 hover:text-gray-800">
                Cancel
            </Link>
        </div>
      </form>
    </div>
  );
}