import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
  const endpoint = '/api/auth/login';
  const fullUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) + endpoint : baseUrl + endpoint;

  console.log('Proxying login request to:', fullUrl);
  console.log('Request body:', { email, password });
  console.log('Request headers:', Object.fromEntries(request.headers));

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Backend response status:', response.status);
    const text = await response.text();
    console.log('Backend response text:', text);

    const data = text ? JSON.parse(text) : {};

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}