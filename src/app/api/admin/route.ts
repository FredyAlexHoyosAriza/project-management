// app/api/hello/route.js
export async function GET() {
    return new Response(JSON.stringify({ message: "Hello, admin!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }