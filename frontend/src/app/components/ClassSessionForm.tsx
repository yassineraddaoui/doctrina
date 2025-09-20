'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ClassSessionFormData {
  title: string;
  startAt: string;
  durationMinutes: number;
  online: boolean;
  roomId: string;
}

export default function ClassSessionForm() {
  const [formData, setFormData] = useState<ClassSessionFormData>({
    title: '',
    startAt: '',
    durationMinutes: 60,
    online: true,
    roomId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    console.log('ClassSessionForm mounted, success state:', success);
    const role = localStorage.getItem('role');
    setUserRole(role || '');
    return () => {
      console.log('ClassSessionForm unmounted');
    };
  }, [success]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
          ? parseInt(value) || 0
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if ((!formData.title && !formData.startAt) || loading) {
      console.log('Form submission prevented - empty form or already loading');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (!formData.title || !formData.startAt) {
        throw new Error('Title and start time are required');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const startDateTime = new Date(formData.startAt).toISOString();

      const response = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          startAt: startDateTime,
          teacherId: 'current-user', // handled by backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setSuccess(true);

      // Reset form
      setFormData({
        title: '',
        startAt: '',
        durationMinutes: 60,
        online: true,
        roomId: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    if (userRole === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/doctrina');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create Class Session</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Schedule a new class session</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Class Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter class title"
                required
              />
            </div>

            <div>
              <label htmlFor="startAt" className="block text-sm font-medium text-gray-700">
                Start Date & Time *
              </label>
              <input
                id="startAt"
                name="startAt"
                type="datetime-local"
                value={formData.startAt}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                id="durationMinutes"
                name="durationMinutes"
                type="number"
                min="15"
                max="480"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                Room ID
              </label>
              <input
                id="roomId"
                name="roomId"
                type="text"
                value={formData.roomId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter room ID (optional)"
              />
            </div>

            <div className="flex items-center">
              <input
                id="online"
                name="online"
                type="checkbox"
                checked={formData.online}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="online" className="ml-2 block text-sm text-gray-900">
                Online session
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Create Class Session'
              )}
            </button>
          </div>

          {error && (
            <div
              className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div
              className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
              role="alert"
            >
              <p>Class session created successfully!</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Create Another Session
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/sessions')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  View All Sessions
                </button>
                <button
                  type="button"
                  onClick={handleBackToDashboard}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="text-center">
          <button
            onClick={handleBackToDashboard}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
