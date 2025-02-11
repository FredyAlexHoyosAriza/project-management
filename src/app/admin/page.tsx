// Página principal del panel de administración
import { auth0 } from "@/lib/auth0";

export default async function Page() {
  const session = await auth0.getSession();
  return (
    <div>
      <h1>Admin</h1>
      <div>{session ? session.user.name : 'Index del panel de administración'}</div>
    </div>
  );
};

