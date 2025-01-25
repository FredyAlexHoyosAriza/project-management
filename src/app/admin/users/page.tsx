import { GET_USERS } from '@/graphql/users/queries';
import { getClient } from '@/lib/apolloClient';

export default async function Users() {
  // Ejecuta la consulta directamente
  const { data } = await getClient().query({ query: GET_USERS });

  // Puedes usar los datos obtenidos para renderizar contenido
  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {data.getUsers.map(({ _id, name, surname, email }: any) => (
          <li key={_id}>{`${name} ${surname}. email: ${email}`}</li>
        ))}
      </ul>
    </div>
  );
}
