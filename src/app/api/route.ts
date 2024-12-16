// Para la solicitud GET
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {//request: Request
  console.log('Respondiendo a petición GET');//Se imprime en terminal
  return new NextResponse('Hello, GET!', {
    headers: { 'Content-Type': 'text/plain' },
  });
  // return new Response('Hello, GET!', {
  //   headers: { 'Content-Type': 'text/plain' },
  // });
}

// Para la solicitud POST
export async function POST(request: NextRequest) {
  console.log('Respondiendo a petición POST'); // Se imprime en terminal
  const data = await request.json(); // Parseamos el JSON de la solicitud
  // JSON.stringify() toma un objeto JavaScript y lo convierte en un string en formato JSON. 
  // Esto es útil para: Enviar datos JSON a través de una red. Almacenar datos en formato JSON. y
  // Preparar datos para ser enviados como respuesta HTTP; En HTTP, los datos siempre se envían como texto
  // binario (bytes). Entonces, incluso cuando envías un JSON, técnicamente lo envías como texto.
  return NextResponse.json({
    message: 'Hello, POST!',
    receivedData: data,
  });
  // return new Response(JSON.stringify({ message: 'Hello, POST!', receivedData: data }), {
  //   headers: { 'Content-Type': 'application/json' },
  // });
}