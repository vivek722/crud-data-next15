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
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            )
        }
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
        
        const PasswordValid = await compare(password, user.password);
        if (!PasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
        const payload = {
            id: user._id,
            email: user.email,
            userName: user.userName,
        };
        const JWTToken =  await generateJWT(payload)
        return NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user._id,
                    userName: user.userName,
                    email: user.email,
                    Tokem:JWTToken
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