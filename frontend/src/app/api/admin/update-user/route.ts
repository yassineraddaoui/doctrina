import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const userData = await request.json();
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
  }

  try {
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';
    const response = await fetch(`${baseUrl}/admin/update-user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
