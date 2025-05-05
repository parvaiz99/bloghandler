'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PostActions({ postId, isAuthor }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Only render buttons if the current user is the author
  if (!isAuthor) {
    return null; // Render nothing if not the author
  }

  const handleDelete = async () => {
    setError('');


    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      console.log(`PostActions: Attempting DELETE /api/posts/${postId}`);
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });


      if (!res.ok) {
        const data = await res.json().catch(() => ({})); // Try to get error message
        console.error(`PostActions: Delete failed - Status: ${res.status}`, data);
        setError(data.message || `Failed to delete post. Status: ${res.status}`);
        setIsDeleting(false);
        return;
      }

      // Deletion successful
      console.log(`PostActions: Post ${postId} deleted successfully.`);

      // Redirect to the blog list page
      router.push('/blog');
      router.refresh();

    } catch (err) {
      console.error('PostActions: Error during delete fetch:', err);
      setError('An error occurred while deleting the post.');
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Error Message */}
      {error && (
        <p className="mt-4 text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
      )}
      <div className="flex space-x-4 pt-4 border-t border-gray-200 mt-4">

        <Link
          href={`/posts/edit/${postId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150"
        >
          Edit Post
        </Link>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete Post'}
        </button>
      </div>
    </>
  );
}