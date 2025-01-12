import { UserModel, IUser, ICreateUser } from "@/api/server/database/models/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/api/server/database/mongoose";

export const addUser = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await dbConnect();

    const body: ICreateUser = await req.json(); // Parseamos el JSON del body
    const user: IUser = await UserModel.create(body);

    return NextResponse.json(user, { status: 201 })
  } catch (error: unknown) {
    // Puesto que error es de un tipo de mongoose si cuenta con atributo code (Error de typescript no)
    // trate a error sin tipo para poder acceder a atributo code que si existe
    if (error instanceof mongoose.Error && 'code' in error && error.code === 11000) {
      console.error("Error de índice único al insertar el usuario:", error);
      return NextResponse.json({ error: 'El usuario ya existe.' }, { status: 406 })
    }

    console.error("Error desconocido al insertar el usuario:", error);
    return NextResponse.json({ error: 'No se pudo insertar el usuario.' }, { status: 500 })
  }
};

export async function list(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    // Extraer el valor de filtro de la URL
    const { searchFilter } = Object.fromEntries(req.nextUrl.searchParams);
    const searchValue = searchFilter?.toString() || '';

    // Buscar documentos que coincidan parcialmente en los campos especificados
    const docs: Array<IUser> = await UserModel.find({
      $or: [
        { name: { $regex: searchValue, $options: 'i' } },
        { email: { $regex: searchValue, $options: 'i' } },
        { role: { $regex: searchValue, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      {
        error: (error as Error).message || 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}
