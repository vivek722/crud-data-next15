// app/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast'
interface User {
  _id: string;
  userName: string;
  userEmail: string;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("call get APi");
        
        const res = await fetch(`/api/user/Desktop?id=${userId}`);
        const data = await res.json();
        if (data.status && data.users?.[0]) {
          setUser(data.users[0]);
          toast.success(`this ${data.users[0]?.userName} User data loaded`);
        }
      } catch (error) {
        toast.error('Error loading user data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const res = await fetch('/api/user/Desktop', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          userName: user.userName,
          userEmail: user.userEmail,
        }),
      });

      if (res.ok) {
        toast.success('User updated successfully');
         router.push('/Admin/Dashboard');// or '/desktop'
      } else {
        toast.error('Update failed');
        const err = await res.json();
        console.error('Update error:', err);
      }
    } catch (error) {
        toast.error('An error occurred while updating');
        console.error('Error updating user:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Name:</label>
          <input
            value={user.userName}
            onChange={(e) => setUser({ ...user, userName: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={user.userEmail}
            onChange={(e) => setUser({ ...user, userEmail: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ marginLeft: '10px' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}