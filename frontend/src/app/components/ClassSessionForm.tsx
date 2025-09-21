'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from './layout/PageContainer';
import { Header } from './layout/Header';
import { Card, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Alert } from './ui/Alert';

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
    <PageContainer maxWidth="md">
      <Header
        title="Create Class Session"
        subtitle="Schedule a new class session for your students"
        showBackButton
        backUrl={userRole === 'ADMIN' ? '/admin' : '/doctrina'}
      />

      <Card className="max-w-2xl mx-auto">
        <CardBody className="p-8">
          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          {success && (
            <Alert type="success" className="mb-6">
              <div>
                <p className="font-medium mb-3">Class session created successfully!</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => setSuccess(false)}
                  >
                    Create Another
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push('/sessions')}
                  >
                    View All Sessions
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleBackToDashboard}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Class Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter class title"
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Start Date & Time"
                name="startAt"
                type="datetime-local"
                value={formData.startAt}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Duration (minutes)"
                name="durationMinutes"
                type="number"
                min="15"
                max="480"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                helperText="Duration between 15-480 minutes"
              />
            </div>

            <Input
              label="Room ID"
              name="roomId"
              type="text"
              value={formData.roomId}
              onChange={handleInputChange}
              placeholder="Enter room ID (optional for online sessions)"
              helperText="Required for in-person sessions"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                id="online"
                name="online"
                type="checkbox"
                checked={formData.online}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="online" className="text-sm font-medium text-gray-900">
                Online session
              </label>
              <div className="text-xs text-gray-500">
                Check this for virtual/online sessions
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Creating Session...' : 'Create Class Session'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </PageContainer>
  );
}