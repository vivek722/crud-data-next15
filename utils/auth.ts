import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
export function generateJWT(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

