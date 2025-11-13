import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
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
