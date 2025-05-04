// src/app/api/posts/[id]/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper function to check ownership (no changes needed here)
async function checkOwnership(postId, session) {
    if (!session?.user?.id) return false;
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
    });
    return post?.authorId === session.user.id;
}


// GET /api/posts/[id] - Get a single post by ID
export async function GET(req, { params }) {
    // --- CHANGE HERE ---
    const id = params?.id; // Extract ID here
    if (!id) return NextResponse.json({ message: 'Missing post ID' }, { status: 400 });
    // --- END CHANGE ---

    try {
        console.log(`API: Fetching post with ID: ${id}`); // Use the extracted id variable
        // Rest of the try block uses the id variable...
        const post = await prisma.post.findUnique({
            where: { id: id }, // Use variable
            include: { author: { select: { id: true, name: true, email: true }, }, },
        });
        if (!post) { /* ... */ }
        console.log(`API: Post found: ${post.title}`);
        return NextResponse.json(post, { status: 200 });
    } catch (error) { /* ... */ }
}


// PUT /api/posts/[id] - Update a specific post
export async function PUT(req, { params }) {
    // --- CHANGE HERE ---
    const id = params?.id; // Extract ID here
    if (!id) return NextResponse.json({ message: 'Missing post ID' }, { status: 400 });
    // --- END CHANGE ---

    const session = await getServerSession(authOptions);
    const isOwner = await checkOwnership(id, session); // Use variable
    if (!isOwner) { /* ... */ }

    try {
        const body = await req.json();
        const { title, content, published } = body;
        // Validation...

        console.log(`API: Updating post ${id} by user ${session.user.id}`); // Use variable

        const updatedPost = await prisma.post.update({
            where: { id: id }, // Use variable
            data: { title, content, published },
        });

        console.log(`API: Post ${id} updated successfully`); // Use variable
        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) { /* ... */ }
}


// DELETE /api/posts/[id] - Delete a specific post
export async function DELETE(req, { params }) {
     // --- CHANGE HERE ---
    const id = params?.id; // Extract ID here
    if (!id) return NextResponse.json({ message: 'Missing post ID' }, { status: 400 });
    // --- END CHANGE ---

    const session = await getServerSession(authOptions);
    const isOwner = await checkOwnership(id, session); // Use variable
    if (!isOwner) { /* ... */ }

    try {
        console.log(`API: Deleting post ${id} by user ${session.user.id}`); // Use variable

        await prisma.post.delete({
            where: { id: id }, // Use variable
        });

        console.log(`API: Post ${id} deleted successfully`); // Use variable
        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } catch (error) { /* ... */ }
}