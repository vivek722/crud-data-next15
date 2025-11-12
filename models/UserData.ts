import mongoose, { Schema } from "mongoose";
import Counter from './Counter';
export interface user{
    // _id: number;
    userName:string,
    email:string,
    phone:string,
    password: string,
    role:string
    isActive:boolean
    emailVerified :boolean
    createdAt:Date,
    updatedAt:Date
}

const userSchema = new Schema({
  _id: { type: Number }, // ← Explicitly define as Number
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'vendor'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


userSchema.pre('save', async function (next) {
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
export default mongoose.models.User || mongoose.model<user>("User", userSchema);