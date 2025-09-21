'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserEmailFromToken } from '../utils/jwt';
import { PageContainer } from '../components/layout/PageContainer';
import { Header } from '../components/layout/Header';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch class sessions');
      const data = await response.json();
      const sessionsData = Array.isArray(data) ? data : [];

      // Get current user's email from JWT token
      const currentUserEmail = token ? getUserEmailFromToken(token) : null;

      // Check enrollment status for each session
      const sessionsWithEnrollment = sessionsData.map((session) => {
        const isEnrolled = currentUserEmail
          ? session.students.some((student: User) => student.email === currentUserEmail)
          : false;

        return {
          ...session,
          isEnrolled,
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Update the session's enrollment status locally
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === sessionId ? { ...session, isEnrolled: true } : session
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join session');
    } finally {
      setJoiningSession(null);
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
    <PageContainer>
      <Header
        title="Class Sessions"
        subtitle="Manage and join your class sessions"
        showBackButton
        backUrl={userRole === 'ADMIN' ? '/admin' : '/doctrina'}
        actions={
          userRole !== 'STUDENT' ? (
            <Button
              onClick={() => router.push('/sessions/create')}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Create Session
            </Button>
          ) : null
        }
      />

      {loading && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" text="Loading sessions..." />
        </div>
      )}

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {!loading && !error && sessions.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No class sessions found</h3>
            <p className="text-gray-600 mb-6">
              {userRole === 'STUDENT' 
                ? 'No sessions are available to join at the moment.' 
                : 'Get started by creating your first class session.'
              }
            </p>
            {userRole !== 'STUDENT' && (
              <Button onClick={() => router.push('/sessions/create')}>
                Create Your First Session
              </Button>
            )}
          </CardBody>
        </Card>
      )}

      {!loading && !error && sessions.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id} hover>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{session.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    session.online 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {session.online ? 'Online' : 'In-person'}
                  </span>
                </div>
              </CardHeader>
              
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDateTime(session.startedAt)}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {session.durationMinutes} minutes
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {session.teacher.fullName}
                  </div>
                  
                  {session.room && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Room {session.room}
                    </div>
                  )}
                </div>
                
                {userRole === 'STUDENT' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {session.isEnrolled ? (
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Enrolled
                        </span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleJoinSession(session.id)}
                        loading={joiningSession === session.id}
                        className="w-full"
                        size="sm"
                      >
                        {joiningSession === session.id ? 'Joining...' : 'Join Session'}
                      </Button>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}