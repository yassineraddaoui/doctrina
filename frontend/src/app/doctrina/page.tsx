'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctrinaPage() {
  const router = useRouter();
  const [role, setRole] = useState('');

  useEffect(() => {
    // Run this only on the client side
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    // Redirect to login if no token
    if (!token) {
      router.push('/login');
      return;
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Doctrina Space</h1>
          <p className="text-gray-600 mb-6">
            This is your learning management system dashboard. Here you can access your courses,
            assignments, and learning materials.
          </p>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">My Courses</h3>
              <p className="text-blue-700">Access your enrolled courses and learning materials.</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Assignments</h3>
              <p className="text-green-700">View and submit your assignments.</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Progress</h3>
              <p className="text-purple-700">Track your learning progress and achievements.</p>
            </div>
          </div>

          {/* Teacher-specific actions */}
          <div className="mt-8">
            {/* Show the heading only if role !== STUDENT */}
            {role !== 'STUDENT' && (
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Teacher Actions</h2>
            )}
            <div className="flex flex-wrap gap-4">
              {/* Show "Create Class Session" only if role !== STUDENT */}
              {role !== 'STUDENT' && (
                <button
                  onClick={() => router.push('/sessions/create')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Create Class Session
                </button>
              )}

              {/* This button is always visible */}
              <button
                onClick={() => router.push('/sessions')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                View Class Sessions
              </button>
            </div>
          </div>

          {/* Logout button */}
          <div className="mt-8">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                router.push('/login');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
