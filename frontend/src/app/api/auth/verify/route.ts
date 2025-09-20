import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    console.log('Verifying token:', token);
    
    // For now, just return success since we don't have a proper database setup
    // In a real application, you would verify the token against your database
    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Existing POST logic (if needed)
  return NextResponse.json({ error: 'POST not implemented' }, { status: 405 });
}