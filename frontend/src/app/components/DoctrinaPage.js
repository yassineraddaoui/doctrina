import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function DoctrinaPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Doctrina Page</h1>
      <p>Welcome to the Doctrina space for non-admin users.</p>
    </div>
  );
}

export default DoctrinaPage;