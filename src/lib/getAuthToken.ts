// Importa el helper para leer cookies en Server Components (Next.js 15+)
import { cookies } from 'next/headers';

/**
 * Función asíncrona para obtener el token de autenticación.
 * En un entorno de servidor, `cookies()` de Next.js permite acceder a las cookies.
 * Se obtiene el token de autenticación desde la cookie "__session".
 * Se asume que Auth0 almacena el token (o la información de la sesión) en esta cookie.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    // En el servidor (por ejemplo, en rutas o en funciones de carga), usamos `cookies()`
    // Para obtener el token crudo para inyectarlo en los headers lo más directo es leer
    // la cookie con el helper de Next.js
    const cookieStore = await cookies();
    const token = cookieStore.get('__session')?.value;
    return token || null;
  } catch (error) {
    // En caso de error, retornamos null
    console.error('Error obteniendo el token:', error);
    return null;
  }
}
