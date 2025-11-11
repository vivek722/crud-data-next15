import dbConnect from "@/lib/db";
import { NextRequest,NextResponse } from "next/server";
import Product from "@/models/Product";
import { request } from "http";
import logger from '@/lib/logger';
export async function Post(request:NextRequest) {
    try{
        await dbConnect();
        logger.info("Database Connect successfully")
        const  {name,slug,description,shortDescription,sku,price,comparePrice,costPrice,taxClass,weight,dimensions,inventoryTracking,stockQuantity,minStockLevel,isActive,isFeatured,metaTitle,metaDescription} = await request.json()
    }
    catch(err)
    {
        logger.error(`Error fetching Products ${err}`)
        console.error('Error fetching Products:', err);
        return NextResponse.json({ status: false, message: `Error fetching Products ${err}` }, { status: 500 });
    } 
}

export async function GET() {
    try{
        await dbConnect
        logger.info("Database Connect successfully")
        const product = await Product.find();
        return NextResponse.json({ status: true, product }, { status: 200 });
    }
    catch(err)
    {
        logger.error(`Error fetching Products ${err}`)
        console.error('Error fetching Products:', err);
        return NextResponse.json({ status: false, message: `Error fetching Products ${err}` }, { status: 500 });
    }
}

export async function GETById(id:number) {
    try{
        await dbConnect
        logger.info("Database Connect successfully")
        const product = await Product.find({id});
        return NextResponse.json({ status: true, product }, { status: 200 });
    }
    catch(err)
    {
        logger.error(`Error fetching  ProductBYID ${err}`)
        console.error('Error fetching ProductBYID:', err);
        return NextResponse.json({ status: false, message: `Error fetching ProductBYID ${err}` }, { status: 500 });
    }
}

export async function DELETE(id:number) {
    try{
        await dbConnect
        logger.info("Database Connect successfully")
        const deletedProduct = await Product.findByIdAndDelete({id});
        if(!deletedProduct){
            logger.warn(`Error Product not found`)
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ status: true, deletedProduct  }, { status: 200 });
    }
    catch(err)
    {
        logger.error(`Error delete  ProductBYID ${err}`)
        console.error('Error delete ProductBYID:', err);
        return NextResponse.json({ status: false, message: `Error fetching ProductBYID ${err}` }, { status: 500 });
    }
}

// export async function PUT(request: NextRequest) {
//   try {
//     await dbConnect();
//     logger.info("Database connected successfully");

//     const body = await request.json();
//     const { productId, ...updateData } = body;

//     if (!productId) {
//       return NextResponse.json(
//         { message: 'Product ID is required' },
//         { status: 400 }
//       );
//     }

//     // Remove productId from update data to prevent updating the ID
//     delete updateData.productId;

//     // Add updatedAt timestamp
//     const updateFields: Product = {
//       ...updateData,
//       updatedAt: new Date()
//     };

//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       updateFields,
//       { new: true, runValidators: true } // return updated document and run schema validators
//     );

//     if (!updatedProduct) {
//       logger.warn(`Product not found for ID: ${productId}`);
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       );
//     }

//     logger.info(`Product updated successfully`, {
//       productId: updatedProduct._id.toString(),
//       productName: updatedProduct.name
//     });

//     return NextResponse.json(
//       {
//         status: true,
//         message: 'Product updated successfully',
//         product: updatedProduct
//       },
//       { status: 200 }
//     );

//   } catch (err: any) { // Type assertion for error handling
//     logger.error(`Error updating product: ${err.message}`);
//     console.error('Error updating product:', err);
//     return NextResponse.json(
//       { status: false, message: `Error updating product: ${err.message || err}` },
//       { status: 500 }
//     );
//   }
// }