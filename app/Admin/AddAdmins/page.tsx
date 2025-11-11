'use client' 
import  React, { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import  {Roles} from '@/Constants/Role'
export default function LoginPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [Phone, setUserPhone] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

 
     const Role =Roles.admin;
     const isActive = true;
     const Emailverified = true;

    const validateform =() =>{
         if(!userName){
            setError('userName is required');
            return false;
        }
        if(!userEmail){
            setError('Email is required');
            return false;
        }
        else if(userEmail.indexOf('@')===-1){
            setError('Please enter valid email address');
            return false;
        }
        if(!userPassword){
            setError('Password is required');
            return false;
        }
        else if(userPassword.length <6){
            setError('Password must be at least 6 characters long');
            return false;
        }
        if(!Phone){
            setError('Phone is required');
            return false;
        }
        else if(userPassword.length  ==10){
            setError('phone  No must be at have 10 digit');
            return false;
        }
        return true;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if(!validateform()){
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName,  userEmail, Phone, userPassword,Role,isActive,Emailverified}),
            });

             const data = await response.json();
            if (response.ok) {
                toast.success('Registration successful!');
                router.push('/Admin/Dashboard');
            } else {
                toast.error(data.message || 'An error occurred during login');
                setError(data.message || 'An error occurred during login');
            }
        } catch (error) {
            toast.error('An error occurred during login');
            setError('An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    }
    function setSignInPage(){
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
                            value={userEmail}
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
                            value={userPassword}
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