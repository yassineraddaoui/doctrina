'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '../components/layout/PageContainer';
import { Header } from '../components/layout/Header';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
    <PageContainer>
      <Header
        title="Welcome to Doctrina Space"
        subtitle="Your learning management system dashboard"
        actions={
          <Button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              router.push('/login');
            }}
            variant="ghost"
          >
            Logout
          </Button>
        }
      />

      {/* Welcome Message */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardBody className="p-8">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
                </h2>
                <p className="text-indigo-100">
                  Ready to continue your learning journey? Access your courses, assignments, and track your progress.
                </p>
              </div>
              <div className="hidden md:block">
                <svg className="w-24 h-24 text-white opacity-20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card hover>
          <CardBody className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Courses</h3>
            <p className="text-gray-600 text-sm">Access your enrolled courses and learning materials</p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignments</h3>
            <p className="text-gray-600 text-sm">View and submit your assignments</p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
            <p className="text-gray-600 text-sm">Track your learning progress and achievements</p>
          </CardBody>
        </Card>
      </div>

      {/* Class Sessions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Class Sessions</h2>
              <p className="text-sm text-gray-600 mt-1">Manage and join your class sessions</p>
            </div>
          </div>
        </CardHeader>
        
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            {role !== 'STUDENT' && (
              <Button
                onClick={() => router.push('/sessions/create')}
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Create Class Session
              </Button>
            )}

            <Button
              onClick={() => router.push('/sessions')}
              variant="secondary"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
            >
              View All Sessions
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Completed Assignments</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Upcoming Sessions</div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}