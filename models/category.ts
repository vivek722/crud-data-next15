import mongoose, {Schema} from "mongoose";
import Counter from "./Counter";

export interface Category{
    name:string,
    slug:string,
    description:string
    image:string,
    parentId:Schema,
    isActive:boolean,
}

const Categoryschema = new Schema({
    _id : {type:Number},
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
});


// 🔑 Auto-increment middleware
Categoryschema.pre('save', async function (next) {
    if (this.isNew) {
      try {
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'User' },        
          { $inc: { seq: 1 } },  
          { new: true, upsert: true }
        );
        this._id = counter!.seq; 
      } catch (err) {
        return next(err as any);
      }
    }
    next();
  });

export default mongoose.models.Category || mongoose.model<Category>("Category",Categoryschema)