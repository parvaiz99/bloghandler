// src/app/blog/page.js
import Link from 'next/link';
import prisma from '@/lib/prisma'; // Import your prisma instance

// Add this line to force dynamic rendering (SSR-like behavior) for this page
export const dynamic = 'force-dynamic';

// Function to fetch data - runs on the server
async function getPosts() {
  try {
    // Added (dynamic) to log message for clarity
    console.log("Blog Page: Fetching published posts (dynamic)...");
    const posts = await prisma.post.findMany({
      where: { published: true }, // Fetch only published posts
      include: {
        author: {
          select: { name: true }, // Only fetch author's name
        },
      },
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
    });
    // Added (dynamic) to log message for clarity
    console.log(`Blog Page: Found ${posts.length} published posts (dynamic).`);
    return posts;
  } catch (error) {
    console.error("Blog Page: Failed to fetch posts (dynamic):", error);
    // In a real app, you might want to throw the error or return an empty array/error state
    return [];
  }
}


// The Page component itself (Server Component)
export default async function BlogListPage() {
  // Fetch data directly within the Server Component
  const posts = await getPosts();

  return (
    // Added bg-gray-50 previously, keeping it for potential light background if needed
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Blog Posts</h1>

      {/* Display message if no posts found */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No published posts yet.</p>
      ) : (
        // Display list of posts
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              {/* Post Title as Link */}
              <h2 className="text-2xl font-semibold mb-2 text-indigo-700 hover:text-indigo-900">
                <Link href={`/blog/${post.id}`}>
                  {post.title}
                </Link>
              </h2>
              {/* Author and Date */}
              <p className="text-sm text-gray-500 mb-3">
                By {post.author?.name || 'Unknown Author'} on {new Date(post.createdAt).toLocaleDateString()}
              </p>
              {/* Content Snippet */}
              {post.content && (
                <p className="text-gray-700 line-clamp-3"> {/* Shows first 3 lines */}
                  {post.content}
                </p>
              )}
              {/* Read More Link */}
              <Link href={`/blog/${post.id}`} className="text-indigo-600 hover:text-indigo-800 inline-block mt-3 text-sm font-medium">
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

// Note: 'export const revalidate = 60;' should be removed or commented out
// when using 'export const dynamic = 'force-dynamic';'