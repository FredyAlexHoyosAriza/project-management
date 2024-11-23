export async function GET() {
    return new Response('Hello, hello!', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }