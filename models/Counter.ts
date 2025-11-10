// models/Counter.ts
import { Schema, model, models } from 'mongoose';

const counterSchema = new Schema({
  _id: { type: String, required: true }, // e.g., "User"
  seq: { type: Number, default: 1000 }   // Start from 1001
});

const Counter = models.Counter || model('Counter', counterSchema);
export default Counter;