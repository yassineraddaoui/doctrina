'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserEmailFromToken } from '../utils/jwt';

interface User {
  id: number;
  verified: number;
  email: string;
  fullName: string;
  role: string;
}

interface ClassSession {
  id: string | number;
  title: string;
  startedAt: string;
  durationMinutes: number;
  online: boolean;
  teacher: User;
  students: User[];
  room: string | null;
  isEnrolled?: boolean;
}

export default function ClassSessionsPage() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joiningSession, setJoiningSession] = useState<string | number | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    console.log('ClassSessionsPage useEffect running');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('Token exists:', !!token);
    console.log('Role:', role);
    
    if (!token) {
      console.log('No token, redirecting to login');
      router.push('/login');
      return;
    }

    setUserRole(role || '');
    console.log('User authorized, fetching sessions');
    fetchSessions();
  }, [router]);

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/sessions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch class sessions');
      const data = await response.json();
      const sessionsData = Array.isArray(data) ? data : [];
      
      // Get current user's email from JWT token
      const currentUserEmail = token ? getUserEmailFromToken(token) : null;
      
      // Check enrollment status for each session
      const sessionsWithEnrollment = sessionsData.map(session => {
        const isEnrolled = currentUserEmail ? 
          session.students.some((student: User) => student.email === currentUserEmail) : 
          false;
        
        return {
          ...session,
          isEnrolled
        };
      });
      
      setSessions(sessionsWithEnrollment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleJoinSession = async (sessionId: string | number) => {
    setJoiningSession(sessionId);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/sessions/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Update the session's enrollment status locally
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId 
            ? { ...session, isEnrolled: true }
            : session
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join session');
    } finally {
      setJoiningSession(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Class Sessions</h1>
            <button
              onClick={() => router.push('/sessions/create')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create New Session
            </button>
          </div>

          {loading && <p className="text-gray-600">Loading sessions...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {!loading && !error && sessions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No class sessions found.</p>
              <button
                onClick={() => router.push('/sessions/create')}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Create Your First Session
              </button>
            </div>
          )}

          {!loading && !error && sessions.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <div key={session.id} className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Start:</strong> {formatDateTime(session.startedAt)}</p>
                    <p><strong>Duration:</strong> {session.durationMinutes} minutes</p>
                    <p><strong>Type:</strong> {session.online ? 'Online' : 'In-person'}</p>
                    <p><strong>Teacher:</strong> {session.teacher.fullName}</p>
                    {session.room && (
                      <p><strong>Room:</strong> {session.room}</p>
                    )}
                    {userRole === 'STUDENT' && (
                      <div className="mt-3">
                        {session.isEnrolled ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Enrolled
                          </span>
                        ) : (
                          <button
                            onClick={() => handleJoinSession(session.id)}
                            disabled={joiningSession === session.id}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {joiningSession === session.id ? 'Joining...' : 'Join'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={() => router.push('/doctrina')}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
