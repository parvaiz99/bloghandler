// src/app/blog/[id]/page.js

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PostActions from '@/components/PostActions'; // Import the client component

// Function to fetch a single post
async function getPost(params) {
  const id = params?.id;
  if (!id) {
    console.error("Single Post Page: No ID found in params for getPost");
    return null;
  }

  try {
    console.log(`Single Post Page: Fetching post with ID: ${id}`);
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
    if (!post) {
       console.log(`Single Post Page: Post not found with ID: ${id}`);
       return null;
    }
    console.log(`Single Post Page: Found post titled "${post.title}"`);
    return post;
  } catch (error) {
    console.error(`Single Post Page: Failed to fetch post ${id}:`, error);
    return null;
  }
}


// The Page component (Server Component)
export default async function SinglePostPage({ params }) {
  const post = await getPost(params);
  const session = await getServerSession(authOptions); // Fetch session info

  // Handle post not found
  if (!post) {
    notFound();
  }

  // Determine if the current user is the author
  const isAuthor = session?.user?.id === post.author?.id;

  // Authorization check: Prevent viewing draft if not author
  if (!post.published && !isAuthor) {
      console.log(`Single Post Page: Access denied for unpublished post ${post.id} by user ${session?.user?.id || 'guest'}`);
      notFound();
  }


  // --- Render the Page ---
  return (
    <article className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg mt-6">
      {/* Post Header */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By {post.author?.name || 'Unknown Author'} on {new Date(post.createdAt).toLocaleDateString()}
        {post.published ? (
            <span className="ml-3 inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Published</span>
        ) : (
            <span className="ml-3 inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Draft</span>
        )}
      </p>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none mb-8 text-gray-800">
        {/* Render content as plain text, respecting whitespace */}
        <p className="whitespace-pre-wrap">{post.content}</p>
        {/* Add Markdown/HTML rendering logic here if needed instead */}
      </div>

      {/* Action Buttons Area */}
      {/* Render the PostActions client component, passing props */}
      {/* The PostActions component itself will decide whether to show buttons based on isAuthor */}
      <PostActions postId={post.id} isAuthor={isAuthor} />

      {/* Navigation */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <Link href="/blog" className="text-indigo-600 hover:text-indigo-800">
            ← Back to all posts
        </Link>
      </div>

    </article>
  );
}