'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the User interface
interface User {
  id: string | number;
  email: string;
  fullName: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]); // Typed as an array of User objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (email: string) => { // Typed email as string
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleBanUser = async (email: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/ban-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Failed to ban user');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  // Workaround for passing user data: use query params
  const handleUpdateClick = (user: User) => {
    const query = new URLSearchParams({ email: user.email }).toString();
    router.push(`/admin/update?${query}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <button
          onClick={() => router.push('/admin/create')}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
        >
          Create User
        </button>
        <button
          onClick={() => router.push('/sessions/create')}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
        >
          Create Class Session
        </button>
        <button
          onClick={() => router.push('/sessions')}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2 hover:bg-purple-600"
        >
          View Class Sessions
        </button>
        <button
          onClick={fetchUsers}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Refresh User List
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Email</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.fullName}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleUpdateClick(user)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-1 hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.email)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  
                  <button
                    onClick={() => handleBanUser(user.email)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}