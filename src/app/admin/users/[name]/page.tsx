export default async function EditUserPage({params}: {params: Promise<{ name: string }>}) {
  const { name } = await params;
    return (
      <div>
        <h1>Editando usuario con nombre: {name}</h1>
      </div>
    );
  }
  