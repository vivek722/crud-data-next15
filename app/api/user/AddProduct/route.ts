import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import logger from "@/lib/logger";
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

// =============================
// CREATE PRODUCT (POST)
// =============================
export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const product = await Product.create(data);

    return NextResponse.json(
      { status: true, message: "Product created", product },
      { status: 201 }
    );

  } catch (err: any) {
    logger.error("Create Product Error: " + err);
    return NextResponse.json(
      { status: false, message: "Error creating product" },
      { status: 500 }
    );
  }
}

// =============================
// GET ALL PRODUCTS
// =============================
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find();

    return NextResponse.json(
      { status: true, products },
      { status: 200 }
    );

  } catch (err: any) {
    logger.error("Get Products Error: " + err);
    return NextResponse.json(
      { status: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}

// =============================
// DELETE PRODUCT (expects JSON { productId })
// =============================
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const raw = await request.text();
    const { productId } = JSON.parse(raw || "{}");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: true, message: "Product deleted", deleted },
      { status: 200 }
    );

  } catch (err: any) {
    logger.error("Delete Product Error: " + err);
    return NextResponse.json(
      { status: false, message: "Error deleting product" },
      { status: 500 }
    );
  }
}
