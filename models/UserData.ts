import mongoose, { Schema } from "mongoose";
import Counter from './Counter';
export interface user{
    // _id: number;
    userName:string,
    userEmail:string,
    userPassword:string
}

const userSchema = new Schema({
  _id: { type: Number }, // ← Explicitly define as Number
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true }
}, {
  timestamps: true
});

// 🔑 Auto-increment middleware
userSchema.pre('save', async function (next) {
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
export default mongoose.models.User || mongoose.model<user>("User", userSchema);