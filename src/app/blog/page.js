// src/app/blog/page.js
import Link from 'next/link';
import prisma from '@/lib/prisma'; // Import your prisma instance

// Function to fetch data - runs on the server
// Next.js App Router automatically optimizes data fetching in Server Components
async function getPosts() {
  try {
    console.log("Blog Page: Fetching published posts...");
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true }, // Only fetch author's name
        },
      },
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
    });
    console.log(`Blog Page: Found ${posts.length} published posts.`);
    return posts;
  } catch (error) {
    console.error("Blog Page: Failed to fetch posts:", error);
    // In a real app, you might want to throw the error or return an empty array/error state
    return [];
  }
}


// The Page component itself (Server Component)
export default async function BlogListPage() {
  // Fetch data directly within the Server Component
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50"> 
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Blog Posts</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No published posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-2xl font-semibold mb-2 text-indigo-700 hover:text-indigo-900">
                {/* Link to the single post page (we'll create this next) */}
                <Link href={`/blog/${post.id}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                By {post.author?.name || 'Unknown Author'} on {new Date(post.createdAt).toLocaleDateString()}
              </p>
              {/* Optional: Display a snippet of the content */}
              {post.content && (
                 <p className="text-gray-700 line-clamp-3"> {/* Shows first 3 lines */}
                     {post.content}
                 </p>
              )}
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

// Optional: Revalidation settings for Incremental Static Regeneration (ISR)
// export const revalidate = 60; // Re-fetch posts every 60 seconds
// Setting revalidate enables ISR behavior similar to getStaticProps with revalidate