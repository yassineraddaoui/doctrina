import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const { token, fullName, password } = await request.json();

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  if (!fullName || !password) {
    return NextResponse.json({ error: 'Full name and password are required' }, { status: 400 });
  }

  if (fullName.trim().length < 2) {
    return NextResponse.json({ error: 'Full name must be at least 2 characters long' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';
    const response = await fetch(`${baseUrl}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        fullName: fullName.trim(),
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
