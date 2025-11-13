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

// ==========================
// CREATE PRODUCT
// ==========================
export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      logger.error("Unauthorized to create Product");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);

    return NextResponse.json(
      { status: true, message: "Created", product },
      { status: 201 }
    );

  } catch (err) {
    logger.error(`Create Product Error: ${err}`);
    return NextResponse.json(
      { status: false, message: "Error creating product" },
      { status: 500 }
    );
  }
}

// ==========================
// GET ALL PRODUCTS
// ==========================
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find();
    return NextResponse.json({ status: true, products });
  } catch (err) {
    logger.error(`Get Product Error: ${err}`);
    return NextResponse.json(
      { status: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE PRODUCT (BODY: { productId })
// ==========================
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await request.text();
    const { productId } = JSON.parse(raw || "{}");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: true, deleted }, { status: 200 });

  } catch (err) {
    logger.error(`Delete Product Error: ${err}`);
    return NextResponse.json(
      { status: false, message: "Error deleting product" },
      { status: 500 }
    );
  }
}
