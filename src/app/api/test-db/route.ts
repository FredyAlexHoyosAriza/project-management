import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/mongoose'; // Asegúrate de que esta ruta apunta correctamente al archivo mongoose.ts
import mongoose from 'mongoose';

// Declaramos el esquema y modelo fuera de la función GET para evitar crear un nuevo modelo en cada solicitud.
const TestSchema = new mongoose.Schema({ name: String });
const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);

export async function GET() {
  try {
    // Conectamos a la base de datos
    await testConnection();

    // Crear un documento de prueba
    const testDoc = await TestModel.create({ name: 'Hello, MongoDB!' });

    // Devolver el documento creado
    return NextResponse.json({
      message: 'Conexión exitosa a la base de datos.',
      data: testDoc,
    });
  } catch (error: unknown) {
    // Asegurarse de que el error tiene la propiedad 'message'
    if (error instanceof Error) {
      console.error('Error al conectar a la base de datos:', error.message);  // Registrar el error para depuración
      return NextResponse.json(
        { message: 'Error al conectar a la base de datos.', error: error.message },
        { status: 500 }
      );
    } else {
      // En caso de que el error no sea un objeto de tipo Error
      console.error('Error desconocido:', error);  // Registrar el error para depuración
      return NextResponse.json(
        { message: 'Error desconocido al conectar a la base de datos.' },
        { status: 500 }
      );
    }
  }
}
