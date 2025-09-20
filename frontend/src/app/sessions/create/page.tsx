'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClassSessionForm from '../../components/ClassSessionForm';

export default function CreateClassSessionPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('CreateClassSessionPage useEffect running');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('Token exists:', !!token);
    console.log('Role:', role);
    
    if (!token) {
      console.log('No token, redirecting to login');
      router.push('/login');
      return;
    }
    
    // Check if user is a teacher or admin
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      console.log('User role not authorized, redirecting to doctrina');
      router.push('/doctrina');
      return;
    }
    
    console.log('User authorized, showing form');
  }, [router]);

  return (
    <div>
      <ClassSessionForm />
    </div>
  );
}
