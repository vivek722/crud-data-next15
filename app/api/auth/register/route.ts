import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/UserData';
import { hash } from 'bcryptjs';

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Hello from Next.js API!' });
}

export async function POST(request: NextRequest) {
    try {
         console.log('🔍 [DEBUG] Register API hit');
 

        await dbConnect();
        console.log('🔍 Database connection occur ');
        const { userName, userEmail, userPassword } = await request.json();
        if (!userName || !userEmail || !userPassword) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            )
        }
        if (userPassword.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters long' },
                { status: 400 }
            )
        }
        const hashedPassword = await hash(userPassword, 10);
        const newUser = new User({
            userName,
            userEmail,
            userPassword: hashedPassword,
        });

        await newUser.save();
        console.log('🔍 save data inside database  ');
        const response = NextResponse.json({
            message: 'Registration successful',
            user: {
                id: newUser._id,
                username: newUser.userName,
                email: newUser.userEmail,
            }
        }, { status: 201 });
        return response;
    }
    catch (error) {
        console.error('Error during Registartionnpm install bcryptjs:', error);
        return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

