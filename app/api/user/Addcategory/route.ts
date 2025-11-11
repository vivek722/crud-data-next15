import { NextRequest,NextResponse } from "next/server";
import category from "@/models/category";
import dbConnect from "@/lib/db";
import logger from "@/lib/logger";
import { request } from "http";

export async function POST(request:NextRequest) {
    try{
        await dbConnect()
        logger.info("Database Connect successfully")
        const  {name,slug,description,image,isActive} = await request.json()

        const newCategory = new category({
                    name,
                    slug,
                    description,
                    image,
                    isActive,
                    
                });
        await newCategory.save();
        console.log('save data inside database');
        logger.info('save data inside database')

        const response = NextResponse.json({
            message: 'Registration successful',
            user: {
                id: newCategory._id,
                name: newCategory.name,
                slug:newCategory.slug,
                description: newCategory.description,
                image : newCategory.image,
                isActive :newCategory.isActive,
            }
        }, { status: 201 });
        return response;
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

export async function DELETE(id:Number) {
    try{
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