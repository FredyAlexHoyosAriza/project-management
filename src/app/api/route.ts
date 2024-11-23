// Para la solicitud GET
export async function GET() {//request: Request
  return new Response('Hello, GET!', {
    headers: { 'Content-Type': 'text/plain' },
  });
}

// Para la solicitud POST
export async function POST(request: Request) {
  const data = await request.json();
  return new Response(`Hello, POST! Received data: ${JSON.stringify(data)}`, {
    headers: { 'Content-Type': 'application/json' },
  });
}