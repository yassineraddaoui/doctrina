'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

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
    <PageContainer maxWidth="md" className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8 fade-in">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <Card className="shadow-xl border-0">
          <CardBody className="p-8">
            {message && (
              <Alert 
                type={message.includes('successful') ? 'success' : 'error'} 
                className="mb-6"
              >
                {message}
              </Alert>
            )}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </svg>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />
          </div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                helperText="Password must be at least 6 characters long"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
          <h1 className="text-3xl font-bold text-gradient mb-2">Join Doctrina Space</h1>
              <div className="space-y-1">
                <label className="form-label">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                </select>
              </div>
          <p className="text-gray-600">Create your account to get started</p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Create Account
              </Button>
            </form>
        </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}