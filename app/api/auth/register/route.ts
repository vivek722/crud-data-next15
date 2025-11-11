import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/UserData';
import { hash } from 'bcryptjs';
import  logger  from '@/lib/logger';
export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Hello from Next.js API!' });
}

export async function POST(request: NextRequest) {
    try {
         console.log('🔍 [DEBUG] Register API hit');
 

        await dbConnect();
        logger.info(' Database connection occur ')
        console.log(' Database connection occur ');
        const { userName, email,phone, password,role,isActive,emailVerified } = await request.json();
        const hashedPassword = await hash(password, 10);
        const newUser = new User({
            userName,
            email,
            phone,
            password: hashedPassword,
            role,
            isActive,
            emailVerified,
            createdAt : Date.now(),
            updatedAt : Date.now()
        });

        await newUser.save();
        logger.info(' save data inside database  ')
        console.log(' save data inside database  ');
        const response = NextResponse.json({
            message: 'Registration successful',
            user: {
                id: newUser._id,
                username: newUser.userName,
                phone:newUser.phone,
                email: newUser.email,
                role : newUser.role,
                isActive :newUser.isActive,
                emailVerified:newUser.emailVerified,
                createdAt:newUser.createdAt,
                updatedAt :newUser.updatedAt,
            }
        }, { status: 201 });
        return response;
    }
    catch (error) {
        logger.error(`Error insert user ${error}`)
        console.error('Error during Registartionnpm install bcryptjs:', error);
        return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

