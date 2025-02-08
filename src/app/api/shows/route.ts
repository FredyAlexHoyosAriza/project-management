// app/api/shows/route.ts
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse, NextRequest } from 'next/server';

export const GET = withApiAuthRequired(async function shows(
  req: NextRequest
): Promise<NextResponse> {
  try {
    // Creamos una instancia de NextResponse para usarla en getAccessToken
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['read:shows']
    });

    // Usamos una variable para el puerto de la API, con un valor por defecto si no está definida
    const apiPort = process.env.API_PORT || 3001;
    const apiResponse = await fetch(`http://localhost:${apiPort}/api/shows`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const shows = await apiResponse.json();

    // Retornamos la respuesta en formato JSON
    return NextResponse.json(shows);
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      // Si el error tiene una propiedad 'status', la usamos (de lo contrario, 500)
      statusCode = (error as any).status || 500;
    }
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
});
