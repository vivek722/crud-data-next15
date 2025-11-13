import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/UserData";
import logger from "@/lib/logger";
import  jwt from "jsonwebtoken";
function verifyAuth(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;
  
    const token = authHeader.replace("Bearer ", "");
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return null;
    }
  }

export async function GET(request: NextRequest) {
    try {
        
        await dbConnect();
        const users = await User.find({});
        return NextResponse.json({ status: true, users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
export async function GETById(id: NextRequest) {
    try {
        await dbConnect();
        const users = await User.findById(id);
        return NextResponse.json({ status: true, users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function serachUser(userName: NextRequest) {
    try {
        
        await dbConnect();
        const users = await User.find(userName  );
        return NextResponse.json({ status: true, users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
export async function PUT(request: NextRequest) {
    try{
        var user = await verifyAuth(request)
        if(!user){
         logger.error("You are not Unauthorized to update userData")
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const { userId, userName, email } = await request.json();
        if(!userId){
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
            return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
            }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userName, email },
            { new: true ,runValidators: true}
        );
        if(!updatedUser){
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
    }catch(error){
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    
    }
}

export async function DELETE(request: NextRequest) {
    try{
        var user = await verifyAuth(request)
        if(!user){
         logger.error("You are not Unauthorized to Delete user")
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const { userId } = await request.json();
        if(!userId){
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
        }
        catch(error){
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });        
    }
}
