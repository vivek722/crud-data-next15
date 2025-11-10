'use client';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation'
import  React from 'react'              
import {useState } from 'react'
import { rootCertificates } from 'tls';
import toast from 'react-hot-toast'

export interface userResponse{
    _id: number;
    userName:string,
    userEmail:string,
    userPassword:string
}
export default function DesktopPage() {
    const router = useRouter();
    const [count,setCount] = useState(0);
    const [users,setUsers] = useState<userResponse[]>([]);
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);


    
    const handleFetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/user/Desktop', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                if(data.users.length === 0){
                    toast.error('No data   found');
                    setError('No data   found');
                }
                setCount(data.users.length);
                toast.success(`${data.users.length} Data fetched successfully!`);
                setUsers(data.users);
            }
            else {
                  toast.error(data.message || 'An error occurred while fetching data');
                setError(data.message || 'An error occurred while fetching data');
            }
        } catch (error) {
            toast.error('An error occurred while fetching data');
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    }
    async function  handleDeleteUser(id:number){
        setLoading(true);
        setError('');
        try{
            const response = await fetch('/api/user/Desktop', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: id }),
            });
            const data = await response.json();
            if(response.ok){
                toast.success('User deleted successfully');
                handleFetchData();
            }
            else{
                toast.error(data.message || 'An error occurred while deleting user');
                setError(data.message || 'An error occurred while deleting user');
            }
        }catch(error){
            toast.error('An error occurred while deleting user');
            setError('An error occurred while deleting user');
        }finally{
            setLoading(false);
        }
    }
     function handleupdateUser(id:number){
       router.push('/Admin/Dashboard/'+id);
    }
     
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Desktop Data Fetcher</h1>
            <button
                onClick={handleFetchData}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
                disabled={loading}
            >   
                {loading ? 'Loading...' : 'Fetch Desktop Data'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {count !== 0 && <p>Data Count: {count}</p>}

            {users.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Users</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>ID</th>
                                <th style={tableHeaderStyle}>Name</th>
                                <th style={tableHeaderStyle}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td style={tableCellStyle}>{user._id}</td>
                                    <td style={tableCellStyle}>{user.userName}</td>
                                    <td style={tableCellStyle}>{user.userEmail}</td>
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