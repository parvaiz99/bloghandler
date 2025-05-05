import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper function to check ownership 
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
    const id = params?.id;
    if (!id) return NextResponse.json({ message: 'Missing post ID' }, { status: 400 });


    try {
        console.log(`API: Fetching post with ID: ${id}`);

        const post = await prisma.post.findUnique({
            where: { id: id },
            include: { author: { select: { id: true, name: true, email: true }, }, },
        });
        if (!post)
            console.log(`API: Post found: ${post.title}`);
        return NextResponse.json(post, { status: 200 });
    } catch (error) { }
}



export async function PUT(req, { params }) {

    const id = params?.id;
    if (!id) return NextResponse.json({ message: 'Missing post ID' }, { status: 400 });


    const session = await getServerSession(authOptions);
    const isOwner = await checkOwnership(id, session);
    if (!isOwner)

        try {
            const body = await req.json();
            const { title, content, published } = body;


            console.log(`API: Updating post ${id} by user ${session.user.id}`);

            const updatedPost = await prisma.post.update({
                where: { id: id },
                data: { title, content, published },
            });

            console.log(`API: Post ${id} updated successfully`);
            return NextResponse.json(updatedPost, { status: 200 });
        } catch (error) { }
}


// DELETE /api/posts/[id] - Delete a specific post
export async function DELETE(req, { params }) {

    const id = params?.id;
    if (!id) return NextResponse.json({ message: 'Missing post ID' }, { status: 400 });


    const session = await getServerSession(authOptions);
    const isOwner = await checkOwnership(id, session);
    if (!isOwner)

        try {
            console.log(`API: Deleting post ${id} by user ${session.user.id}`);

            await prisma.post.delete({
                where: { id: id },
            });

            console.log(`API: Post ${id} deleted successfully`);
            return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
        } catch (error) { }
}