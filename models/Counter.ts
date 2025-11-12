// models/Counter.ts
import { Schema, model, models } from 'mongoose';

const counterSchema = new Schema({
  _id: { type: String, required: true }, 
  seq: { type: Number, default: 1000 }   
});

const Counter = models.Counter || model('Counter', counterSchema);
export default Counter;