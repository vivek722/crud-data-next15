import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/UserData';
import { compare } from 'bcryptjs';
import { generateJWT } from '@/utils/auth';
import { cookies } from 'next/headers';
export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Hello from Next.js API!' });
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { userEmail, userPassword } = await request.json();
        if (!userEmail || !userPassword) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            )
        }
        const user = await User.findOne({ userEmail });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
        const PasswordValid = await compare(userPassword, user.userPassword);
        if (!PasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
        
        const token = await generateJWT({ userId: user._id.toString() });
         await cookies().set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'lax',
            });
        return NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user._id,
                    userName: user.userName,
                    userEmail: user.userEmail
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );

    }

}