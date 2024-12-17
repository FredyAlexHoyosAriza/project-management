import { handler } from './schema';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
