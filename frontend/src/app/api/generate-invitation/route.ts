import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, role } = await request.json();
    const jwtToken = process.env.NEXT_PUBLIC_JWT_TOKEN;

    if (!jwtToken) {
        return NextResponse.json({ error: 'No JWT token available' }, { status: 401 } as any);
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';
        const response = await fetch(`${baseUrl}/admin/generate-invitation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ email, role }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 } as any
        );
    }
}