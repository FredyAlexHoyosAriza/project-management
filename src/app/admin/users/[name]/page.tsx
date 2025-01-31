export default async function EditUserPage({params}: {params: Promise<{ name: string }>}) {
  let { name } = await params;
  if (name.includes('%3A')) {//edit%3A
    name = name.split('%3A')[1];
  }
    return (
      <div>
        <h1>Editando usuario con nombre: {name}</h1>
      </div>
    );
  }
  