// src/app/api/register/route.js
import prisma from '@/lib/prisma'; // Ensure this path is correct
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // --- Input Validation ---
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing name, email, or password' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }
    // --- End Input Validation ---

    console.log(`Register API: Attempting to register user: ${email}`); // Debug log

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      console.log(`Register API: User already exists: ${email}`); // Debug log
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 }); // Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    console.log(`Register API: User created successfully: ${email}`); // Debug log

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
        { user: userWithoutPassword, message: 'User created successfully' },
        { status: 201 } // Created
    );

  } catch (error) {
    console.error("Registration API error:", error);
    // Handle potential Prisma unique constraint violation explicitly if needed
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
       return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}