'use client'
import React, { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuthStore } from '@/store/AuthStore'
import { setAuthCookie } from '@/lib/cookie'
import { useLoading } from '@/Hooks/useLoading'

export default function LoginPage() {
    const { loading, startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const [email, setUserEmail] = useState('');
    const [password, setUserPassword] = useState('');
    const [error, setError] = useState('');


    const { login } = useAuthStore();
    const validateform = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        else if (email.indexOf('@') === -1) {
            setError('Please enter valid email address');
            return false;
        }
        if (!password) {
            setError('Password is required');
            return false;
        }
        else if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startLoading();
        setError('');

        if (!validateform()) {
            stopLoading();
            return;
        }

        try {
            const response = await axios.post('/api/auth/Login', {
                email, password,
            });
                toast.success('Login successful!');
                const { user, Token } = response.data.user;
                console.log("logn Token", Token);
                console.log("logn user", user);
                console.log("logn Token", response.data.user.Token);

                login(user, Token);
                setAuthCookie(response.data.user.Token)

            router.push('/Admin/Dashboard');
        } catch (error) {
            toast.error('An error occurred during login');
            setError('An error occurred during login');
            console.error('Login error:', error);
        } finally {
            stopLoading();
        }
    }

    function setSignUpPage() {
        router.push('/auth/register');
    }

    return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white p-8 rounded shadow">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign in to Your Account</h2>
                    {error && <div className="mb-4 text-red-600">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border rounded"
                                value={email}
                                onChange={(e) => setUserEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border rounded"
                                value={password}
                                onChange={(e) => setUserPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <button
                            type="button"
                            onClick={setSignUpPage}
                            className="w-full bg-blue-500 text-white  mt-2 py-2 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
    )
}