import { NextRequest,NextResponse } from "next/server";
import category from "@/models/category";
import dbConnect from "@/lib/db";
import logger from "@/lib/logger";
import { uploadImageToAzure } from "@/lib/azure-storage";
import jwt from "jsonwebtoken";
import { use } from "react";


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
export async function POST(request:NextRequest) {
    try{
       var user = await verifyAuth(request)
       if(!user){
        logger.error("You are not Unauthorized to create category")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
       }
       
       
        await dbConnect()
        const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'true';
    const imageFile = formData.get('image') as File | null;



    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Handle file upload if image exists
    let imageUrl = null;
    if (imageFile) {
      // Convert File to buffer and save to your preferred storage
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Example: Save to public folder (for simple cases)
      // In production, use cloud storage like AWS S3, Cloudinary, etc.
      imageUrl = await uploadImageToAzure(buffer, imageFile.name);
    }

    const newCategory = await category.create({
      name,
      slug,
      description,
      image: imageUrl, // Store the image URL/path
      isActive,
    });

    return NextResponse.json(
      { 
        message: 'Category created successfully', 
        category: newCategory 
      },
      { status: 201 }
    );

    }
    catch(err){
        logger.error(`Error insert Category ${err}`)
        console.error('Error insert Category:', err);
        return NextResponse.json({ status: false, message: `Error insert Category ${err}` }, { status: 500 });
    } 
}

export async function GET(request:NextRequest) {
    try{
        await dbConnect()
        logger.info("Database Connect successfully")
        const Allcategory =  await category.find();
        return NextResponse.json({ status: true, Allcategory }, { status: 200 });
    }
    catch(err){
        logger.error(`Error fetching Category ${err}`)
        console.error('Error fetching Category:', err);
        return NextResponse.json({ status: false, message: `Error fetching Category ${err}` }, { status: 500 });
    } 
}

export async function GETById(id:Number) {
    try{
        await dbConnect()
        logger.info("Database Connect successfully")
        const categoryById =  await category.find({id});
        return NextResponse.json({ status: true, categoryById }, { status: 200 });
        
    }
    catch(err){
        logger.error(`Error fetching CategoryById ${err}`)
        console.error('Error fetching CategoryById:', err);
        return NextResponse.json({ status: false, message: `Error fetching CategoryById ${err}` }, { status: 500 });
    } 
}

export async function DELETE(request:NextRequest,{id}:any) {
    try{
      var user = await verifyAuth(request)
      if(!user){
       logger.error("You are not Unauthorized to create category")
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
        await dbConnect()
        logger.info("Database Connect successfully")
        const Allcategory =  await category.findByIdAndDelete(id);
        return NextResponse.json({ status: true, Allcategory }, { status: 200 });
    }
    catch(err){
        logger.error(`Error fetching Category ${err}`)
        console.error('Error fetching Category:', err);
        return NextResponse.json({ status: false, message: `Error fetching Category ${err}` }, { status: 500 });
    } 
}

// export async function DELETE(id:Number) {
//     try{
//         await dbConnect()
//         logger.info("Database Connect successfully")
//         const Allcategory =  await category.findByIdAndDelete(id);
//         return NextResponse.json({ status: true, Allcategory }, { status: 200 });
//     }
//     catch(err){
//         logger.error(`Error fetching Category ${err}`)
//         console.error('Error fetching Category:', err);
//         return NextResponse.json({ status: false, message: `Error fetching Category ${err}` }, { status: 500 });
//     } 
// }