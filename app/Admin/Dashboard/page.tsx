'use client';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import { useState } from 'react'
import { rootCertificates } from 'tls';
import toast from 'react-hot-toast'
import axios from 'axios';
export interface userResponse {
    _id: number;
    userName: string,
    email: string,
    userPassword: string
}
export default function DesktopPage() {
    const router = useRouter();
    const [count, setCount] = useState(0);
    const [users, setUsers] = useState<userResponse[]>([]);
    const [error, setError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleFetchData();
    }, []);

    const handleFetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/user/Desktop')
                if (response.data.users.length === 0) {
                    toast.error('No data   found');
                    setError('No data   found');
                }
                setCount(response.data.users.length);
                toast.success(`${response.data.users.length} Data fetched successfully!`);
                setUsers(response.data.users);
        } catch (error) {
            toast.error('An error occurred while fetching data');
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    }
    async function handleDeleteUser(id: number) {
        setLoading(true);
        setError('');
        try {
            const response = await axios.delete(`/api/user/Desktop/${id}`);
            toast.success('User deleted successfully');
            handleFetchData();
        } catch (error) {
            toast.error('An error occurred while deleting user');
            setError('An error occurred while deleting user');
        } finally {
            setLoading(false);
        }
    }
    function handleupdateUser(id: number) {
        router.push('/Admin/Dashboard/' + id);
    }
    const filteredUsers = useMemo(() => {
        if (!searchText.trim()) return users;
        console.log("SearchText", searchText);

        return users.filter((user) =>
            user.userName.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [users, searchText]);

    function GoToCategory()
    {
        router.push('/Admin/AddCategory')
    }
    function GoToProduct()
    {
        router.push('/Admin/AddProduct')
    }
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Desktop Data </h1>
            <button
                type="button"
                onClick={() => GoToCategory()} // ✅ Pass user ID
                style={{ padding: '6px 12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Go To  AddCategory
            </button>
            <button
                type="button"
                onClick={() => GoToProduct()} // ✅ Pass user ID
                style={{ padding: '6px 12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Go To  AddProduct
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {count !== 0 && <p>Data Count: {count}</p>}
            <label>serach userName</label>
            <input id="searchbox" value={searchText} className='ml-10 p-4 w-30 bg-gray h-10' onChange={(e) => setSearchText(e.target.value)}></input>
            {filteredUsers.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Users</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>ID</th>
                                <th style={tableHeaderStyle}>Name</th>
                                <th style={tableHeaderStyle}>Email</th>
                                <th style={tableHeaderStyle}>DELETE ACTION</th>
                                <th style={tableHeaderStyle}>EDIT ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td style={tableCellStyle}>{user._id}</td>
                                    <td style={tableCellStyle}>{user.userName}</td>
                                    <td style={tableCellStyle}>{user.email}</td>
                                    <td style={tableCellStyle}>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteUser(user._id)} // ✅ Pass user ID
                                            style={{ padding: '6px 12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <button
                                            type="button"
                                            onClick={() => handleupdateUser(user._id)} // ✅ Pass user ID
                                            style={{ padding: '6px 12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}
        </div>



    )

}
const tableHeaderStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#000000ff',
    textAlign: 'left' as const,
};

const tableCellStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    
};