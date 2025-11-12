'use client'
import React, { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'
import { ErrorBoundary } from 'react-error-boundary'
import { useAuthStore } from '@/store/AuthStore'
import { setAuthCookie } from '@/lib/cookie'
export default function LoginPage() {
    const router = useRouter();
    const [email, setUserEmail] = useState('');
    const [password, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

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

    function Fallback({ error, resetErrorBoundary }: any) {
        return (
            <div>
                <pre>{error.message}</pre>
                <button onClick={resetErrorBoundary}>Try again</button>
            </div>
        );
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!validateform()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/Login', {
                email, password,
            });

            toast.success('Login successful!');
            const { user, token } = response.data.user;
            console.log("logn Token", response.data.user);

            login(user, token);
            setAuthCookie(response.data.user.Token)
            localStorage.setItem('userData', JSON.stringify(response));

            router.push('/Admin/Dashboard');
        } catch (error) {
            toast.error('An error occurred during login');
            setError('An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    }

    function setSignUpPage() {
        router.push('/auth/register');
    }

    return (
        <ErrorBoundary
            FallbackComponent={Fallback}
            onReset={() => console.log('Reset triggered')}
        >
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
        </ErrorBoundary>
    )
}