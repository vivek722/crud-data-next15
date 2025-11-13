import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";


import logger from '@/lib/logger';
import jwt from "jsonwebtoken";

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

export async function Post(request:NextRequest) {
    try{
        
        const user = verifyAuth(request);
        if (!user) {
          logger.error("You are not Unauthorized to create Product")
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
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

import logger from "@/lib/logger";

// =========================
// CREATE PRODUCT (POST)
// =========================
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    logger.info("Database connected successfully");

    const body = await request.json();

    const created = await Product.create(body);

    return NextResponse.json(
      { status: true, message: "Product created", product: created },
      { status: 201 }
    );

  } catch (err) {
    logger.error(`Product create error: ${err}`);
    return NextResponse.json(
      { status: false, message: "Error creating product" },
      { status: 500 }
    );
  }
}

// =========================
// GET ALL PRODUCTS
// =========================
export async function GET() {

    try{
       
        await dbConnect()
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

  try {
    await dbConnect();
    logger.info("Database connected successfully");


    const products = await Product.find();

    return NextResponse.json(
      { status: true, products },
      { status: 200 }
    );

  } catch (err) {
    logger.error(`Fetch products error: ${err}`);
    return NextResponse.json(
      { status: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest, { id }: any) {
    try{
        const user = verifyAuth(request);
        if (!user) {
            logger.error("You are not Unauthorized to create Product")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }
        await dbConnect
        logger.info("Database Connect successfully")
        const deletedProduct = await Product.findByIdAndDelete({id});
        if(!deletedProduct){
            logger.warn(`Error Product not found`)
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ status: true, deletedProduct  }, { status: 200 });

// =========================
// DELETE PRODUCT (ID from BODY)
// =========================
export async function DELETE(request: NextRequest) {
  try {
    const raw = await request.text();
    const body = JSON.parse(raw || "{}");
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { status: false, message: "Product ID is required" },
        { status: 400 }
      );

    }

    await dbConnect();

    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return NextResponse.json(
        { status: false, message: "Product not found" },
        { status: 404 }
      );
    }
// export async function PUT(request: NextRequest) {
//   try {
    // const user = verifyAuth(request);
    // if (!user) {
    //     logger.error("You are not Unauthorized to create Product")
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //   }
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

    return NextResponse.json(
      { status: true, message: "Product deleted", deleted },
      { status: 200 }
    );

  } catch (err) {
    logger.error(`Delete product error: ${err}`);
    return NextResponse.json(
      { status: false, message: "Error deleting product" },
      { status: 500 }
    );
  }
}
