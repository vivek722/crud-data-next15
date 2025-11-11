import mongoose, { Schema } from "mongoose";
import Counter from "./Counter";

export interface Product {
    name:String,
    slug:String,
    description :String,
    shortDescription : String,
    sku : String,
    categoryId : Schema
    brandId : Schema
    price : number
    comparePrice : number
    costPrice : number
    taxClass : string
    weight : number
    dimensions: {
        length: Number,
        width: Number,
        height: Number
      },
    inventoryTracking: Boolean,
    stockQuantity:Number,
    minStockLevel:Number,
    isActive:Boolean,
    isFeatured:Boolean,
    metaTitle:string,
    metaDescription:string,
    createdAt:Date,
    updatedAt:Date
}
const productSchema = new Schema({
    _id:{type:Number},
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    shortDescription: String,
    sku: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand' },
    price: { type: Number, required: true },
    comparePrice: Number, // Original price for discount display
    costPrice: Number, // For profit calculation
    taxClass: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    inventoryTracking: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    metaTitle: String,
    metaDescription: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  productSchema.pre('save', async function (next) {
    if (this.isNew) {
      try {
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'User' },        // ← Use 'User' as the key
          { $inc: { seq: 1 } },   // ← Increment by 1
          { new: true, upsert: true }
        );
        this._id = counter!.seq; // ← Assign to _id
      } catch (err) {
        return next(err as any);
      }
    }
    next();
  });

  export default mongoose.models.productSchema || mongoose.model<Product>("Product", productSchema);