import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, firstName, lastName, password, role } = await request.json();

  if (!email || !firstName || !lastName || !password || !role) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const apiUrl = process.env.API_URL || 'http://localhost:8081/api'; // Server-side only
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, firstName, lastName, password, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}