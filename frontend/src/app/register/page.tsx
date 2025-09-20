'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', { // Updated to /api/auth/register
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, password, role }),
        credentials: 'include',
      });

      const text = await response.text();
      console.log('Registration raw response:', {
        status: response.status,
        text: text,
        headers: Object.fromEntries(response.headers.entries()),
      });
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Raw text:', text);
        setMessage('Invalid response format from server.');
        return;
      }
      console.log('Registration parsed response:', data);
      if (response.ok) {
        setMessage(data.message || 'Registration successful');
      } else {
        setMessage(data.error || `Registration failed with status ${response.status}`);
      }
    } catch (err) {
      console.error('Registration fetch error:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error message',
        stack: err instanceof Error ? err.stack : 'No stack trace available',
      });
      setMessage('An unexpected error occurred. Please try again. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900">Register</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
          <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Register
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}