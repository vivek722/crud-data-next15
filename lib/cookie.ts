// lib/cookie.ts
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setAuthCookie = (token: string) => {
  cookies.set('auth-token', token, {
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    sameSite: true,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Set to true if you only need server-side access
  });
};

export const getAuthCookie = (): string | undefined => {
  return cookies.get('auth-token');
};

export const removeAuthCookie = () => {
  cookies.remove('auth-token', { path: '/' });
};