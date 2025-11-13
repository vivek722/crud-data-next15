'use client'
import React, { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Roles } from '@/Constants/Role'
import axios from 'axios'
import { useLoading } from '@/Hooks/useLoading'
export default function LoginPage() {
  const {loading,startLoading,stopLoading} = useLoading()
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [email, setUserEmail] = useState('');
  const [Phone, setUserPhone] = useState('');
  const [password, setUserPassword] = useState('');
  const [error, setError] = useState('');



  const Role = Roles.customer;
  const isActive = true;
  const Emailverified = true;

  const validateform = () => {
    if (!userName) {
      setError('userName is required');
      return false;
    }
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
    if (!Phone) {
      setError('Phone is required');
      return false;
    }
    else if (Phone.length < 10 || Phone.length > 10) {
      setError('phone  No must be at have 10 digit');
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
      const response = await axios.post(
        '/api/auth/register',
        { 
          userName,
          email,
          Phone,
          password,
          Role,
          isActive,
          Emailverified
        },
        {  
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 201) {
        toast.success('Registration successful!');
        router.push('/Admin/Dashboard');
      }
    } catch (error) {  // Fixed: 'isaxios' → 'error'
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred during registration';
        toast.error(errorMessage);
        setError(errorMessage);
        console.error('Registration error:', error);
      } else {
        // Non-Axios error (unexpected)
        toast.error('An unexpected error occurred');
        setError('An unexpected error occurred');
      }
    } finally {
      stopLoading();
    }
  };
  function setSignInPage() {
    router.push('/auth/Login');
  }
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign up to Your Account</h2>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="userName">UserName</label>
              <input
                type="text"
                id="UserName"
                className="w-full px-3 py-2 border rounded"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
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
              <label className="block text-gray-700 mb-2" htmlFor="password">Phone</label>
              <input
                type="Phone"
                id="Phone"
                className="w-full px-3 py-2 border rounded"
                value={Phone}
                onChange={(e) => setUserPhone(e.target.value)}
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
              onClick={setSignInPage}
              className="w-full bg-blue-500  mt-2 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
   
  )
}