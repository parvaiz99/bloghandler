import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getPosts() {
  try {
    console.log("Blog Page: Fetching published posts (dynamic)...");
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(`Blog Page: Found ${posts.length} published posts (dynamic).`);
    return posts;
  } catch (error) {
    console.error("Blog Page: Failed to fetch posts (dynamic):", error);
    return [];
  }
}

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Blog Posts</h1>
        <div className="w-20 h-1 bg-blue-400 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the latest articles from our community
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-blue-50 rounded-xl border border-blue-100">
          <svg className="w-12 h-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700">No published posts yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <Link href={`/blog/${post.id}`} className="block p-6 sm:p-8">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-blue-500 font-medium">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                    {post.author?.name || 'Unknown Author'}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-500 transition-colors">
                  {post.title}
                </h2>

                {post.content && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                )}

                <div className="flex items-center text-blue-500 group">
                  <span className="font-medium">Read more</span>
                  <svg
                    className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}