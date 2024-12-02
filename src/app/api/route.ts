// Para la solicitud GET
export async function GET() {//request: Request
  console.log('Respondiendo a petición GET');//Se imprime en terminal
  return new Response('Hello, GET!', {
    headers: { 'Content-Type': 'text/plain' },
  });
}

// Para la solicitud POST
export async function POST(request: Request) {
  console.log('Respondiendo a petición POST'); // Se imprime en terminal
  const data = await request.json(); // Parseamos el JSON de la solicitud
  return new Response(JSON.stringify({ message: 'Hello, POST!', receivedData: data }), {
    headers: { 'Content-Type': 'application/json' },
  });
}