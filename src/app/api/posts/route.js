import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next'; // To get session server-side
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/posts - Create a new post
export async function POST(req) {
  // Get the session from the server-side using NextAuth function
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, published } = body;

    // --- Basic Validation ---
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }
    if (title.length > 150) {
      return NextResponse.json({ message: 'Title cannot exceed 150 characters' }, { status: 400 });
    }

    const userId = session.user.id; // Get user ID from session

    console.log(`API: Creating post titled "${title}" by user ${userId}`);

    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: published || false,
        authorId: userId,
      },
    });

    console.log(`API: Post created successfully with ID: ${newPost.id}`);

    // Return the newly created post
    return NextResponse.json(newPost, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("API Error Creating Post:", error);
    // Handle potential Prisma errors specifically if needed
    return NextResponse.json(
      { message: 'Failed to create post', error: error.message },
      { status: 500 }
    );
  }
}


// GET /api/posts - Get all PUBLISHED posts
export async function GET(req) {


  try {
    console.log("API: Fetching all published posts");

    const posts = await prisma.post.findMany({
      //************************    ONLY PUBLISHED**************** */
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },

    });


    console.log(`API: Found ${posts.length} published posts`);

    return NextResponse.json(posts, { status: 200 });

  } catch (error) {
    console.error("API Error Fetching Posts:", error);
    return NextResponse.json(
      { message: 'Failed to fetch posts', error: error.message },
      { status: 500 }
    );
  }
}