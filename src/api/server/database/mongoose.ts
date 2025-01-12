import mongoose, { ConnectOptions } from 'mongoose';

// asigna el valor actual de global.mongoose (aunque inicialmente sea undefined), no su tipo
let cached = global.mongoose;

if (!cached) {
// cached se inicializa con el valor de global.mongoose, si es undefined, se inicializa como un objeto con:
// conn: null (no hay conexión activa).
// promise: null (no hay promesa activa).
// Tanto global.mongoose como cached apuntan al mismo objeto, actuando como un caché compartido<<
  cached = global.mongoose = { conn: null, promise: null };
}

export const dbConnect = async (): Promise<void> => {//: Promise<mongoose.Connection>
  if (cached.conn) {
    return; // Si ya hay una conexión, la retornamos // cached.conn
  }

  if (!cached.promise) {
    const clientOptions: ConnectOptions = {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
    };
    
    const uri = process.env.MONGODB_URI || '';
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable in .env.local');
    }

    // Establece la conexión y guarda la promesa
    // Configura y establece la conexión a la base de datos. Devuelve una promesa que se resuelve
    // cuando la conexión se completa
    cached.promise = mongoose.connect(uri, clientOptions).then(() => mongoose.connection);
  }

  // await cached.promise: Espera a que se resuelva la promesa de mongoose.connect, asegurando que la
  // conexión se haya establecido antes de continuar.
  // cached.promise: Es una promesa que, al resolverse, retorna la conexión con la base de datos (mongoose.connection).
  cached.conn = await cached.promise; // Espera la promesa y guarda la conexión

  try {
    if (!cached.conn.db) {
      throw new Error("Database connection is not established properly.");
    }
    await cached.conn.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Propaga el error al llamador
  }

  // return cached.conn;
};

// El Promise<void> de testConnection asegura que todas las operaciones asincrónicas (conexión y ping)
// se completen antes de continuar, pero no retorna datos al llamador.
// export const testConnection = async (): Promise<void> => {
//   try {
//     const connection = await dbConnect();
//     if (!connection.db) {
//       throw new Error("Database connection is not established properly.");
//     }
//     await connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error; // Propaga el error al llamador
//   }
// };
