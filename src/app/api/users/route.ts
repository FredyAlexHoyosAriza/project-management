// VISTA
import { NextResponse, NextRequest } from 'next/server';

type ControllerResponse = { data?: any; error?: string; status: number };
// Función para manejar el request, ejecutar el controlador y enviar respuesta al front
const handleRequest = (controller: (req: Request) => Promise<ControllerResponse>) => 
    async (req: Request) => {      
      const response = await controller(req);
      return NextResponse.json(response.data || { error: response.error }, { status: response.status });
};

// src/app/api/users/route.ts

import { list, addUser } from './controller';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Delegar la lógica al controlador `list`
    return await list(req);
  } catch (error) {
    console.error('Error en la ruta /api/users:', error);
    return NextResponse.json(
      {
        error: (error as Error).message || 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Delegar la lógica al controlador `list`
    return await addUser(req);
  } catch (error) {
    console.error('Error en la ruta /api/users:', error);
    return NextResponse.json(
      {
        error: (error as Error).message || 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; // Para usar en el entorno de ejecución edge

  