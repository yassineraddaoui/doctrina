'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface User {
  id: string | number;
  email: string;
  fullName: string;
  role: string;
}

function UpdatePageContent() {
  const [user, setUser] = useState<User>({ id: '', email: '', fullName: '', role: 'TEACHER' });
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    const fetchUser = async () => {
      if (!email) {
        setError('No user selected for update');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await fetch(`/api/admin/users?email=${email}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        const selectedUser = Array.isArray(data) ? data.find((u) => u.email === email) : data;
        if (selectedUser) setUser(selectedUser);
        else setError('User not found');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    };
    fetchUser();
  }, [email]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('/api/admin/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error('Failed to update user');
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <form onSubmit={handleUpdateUser} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={user.fullName}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Update User
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default function UpdatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePageContent />
    </Suspense>
  );
}