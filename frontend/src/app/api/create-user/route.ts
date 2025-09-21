import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, fullName, password, role } = await request.json();
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'No JWT token available' }, { status: 401 });
  }

  try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';
    const response = await fetch(`${baseUrl}/admin/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, fullName, password, role }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}