'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewUser {
  email: string;
  fullName: string;
  role: string;
}

export default function CreateUserPage() {
  const [newUser, setNewUser] = useState<NewUser>({ email: '', fullName: '', role: 'TEACHER' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('http://localhost:8081/api/admin/create-user', { // Updated to local API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <form onSubmit={handleCreateUser} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={newUser.fullName}
            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create User
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