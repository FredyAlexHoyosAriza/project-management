import mongoose from 'mongoose';

// Interface permite definir tipos que permiten herencia
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Declaración global de `mongoose` con el tipo `MongooseCache`
declare global {
  var mongoose: MongooseCache | undefined;//Antes de definirse o sino se define mongoose es tipo undefined
}

// declare global {
//   var mongoose: {
//     conn: mongoose.Connection | null;
//     promise: Promise<mongoose.Connection> | null;
//   } | undefined;
// }

 // Necesario para evitar conflictos con otros módulos
 // y para convertir el archivo en un módulo
export {};