import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { title, startAt, durationMinutes, online, roomId } = await request.json();
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
  }

  if (!title || !startAt) {
    return NextResponse.json({ 
      error: 'Title and startAt are required' 
    }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        startAt,
        durationMinutes: durationMinutes || 60,
        online: online !== false, // Default to true if not specified
        roomId
      })
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
