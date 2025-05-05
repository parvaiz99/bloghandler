import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PostActions from '@/components/PostActions';


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

export default async function SinglePostPage({ params }) {
  const post = await getPost(params);
  const session = await getServerSession(authOptions);
  const isAuthor = session?.user?.id === post.author?.id;

  if (!post) notFound();
  if (!post.published && !isAuthor) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="h-1 bg-blue-400 w-full"></div>

        <div className="p-6 sm:p-8">
          {/* Post Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span>By {post.author?.name || 'Unknown Author'}</span>
              <span className="text-gray-400">•</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="ml-auto">
                {post.published ? (
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    Published
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    Draft
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-8 text-gray-700">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>

          <PostActions postId={post.id} isAuthor={isAuthor} />

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}