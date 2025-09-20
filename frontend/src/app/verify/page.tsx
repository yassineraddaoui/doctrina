'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/api/auth/verify?token=${token}`, {
          redirect: 'manual',
        });

        if (!response.ok) {
          const data = await response.json();
          setStatus('error');
          setMessage(data.error || 'Verification failed');
          return;
        }

        // If response is OK (200-299), attempt to parse body
        let data;
        try {
          data = await response.json();
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } catch (parseError) {
          // If parsing fails (e.g., empty body), treat as success
          setStatus('success');
          setMessage('Email verified successfully!');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Email Verification</h2>

          {status === 'loading' && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 text-green-600 font-medium">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-4 text-red-600 font-medium">{message}</p>
              <button
                onClick={() => router.push('/register')}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}