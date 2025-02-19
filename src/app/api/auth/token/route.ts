import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ accessToken: null });
  try {
    const accessToken = (await auth0.getAccessToken()).token;
    return NextResponse.json({ accessToken });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
