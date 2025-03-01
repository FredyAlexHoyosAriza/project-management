import { fetchUsers } from "@/services/userService";
import { User } from "@/types/user";
// import { jwtDecode } from "jwt-decode";
import ManageUsers from "@/components/users/ManageUsers";
import { auth0 } from "@/lib/auth0";
// import { redirect } from "next/navigation";
// import { headers } from "next/headers";

export default async function Users() {
  // console.log('Soy Alex y soy un ganador')
  const session = await auth0.getSession();
  // let users: User[] = [];
  // type customJwtPayload = {
  //   "http://localhost/userInfo": { role: string };
  // };
  // if (session) {
  //   users = await fetchUsers();
  //   if (
  //     users.length === 0 ||
  //     jwtDecode<customJwtPayload>(session.tokenSet.accessToken)[
  //       "http://localhost/userInfo"
  //     ].role
  //   ) {
  //     const previousUrl = (await headers()).get("referer") || "/admin"; // Si no hay referer, redirige a /admin
  //     redirect(previousUrl);
  //     // return (
  //     //   <h1 className="h-full w-auto grid place-items-center text-red-800 text-xl">
  //     //     No tienes permisos para ver esta página
  //     //   </h1>
  //     // );
  //   }
  // }
  const users: User[] = session ? await fetchUsers() : [];
  return (
    <div>
      <ManageUsers initialUsers={users} />
    </div>
  );
}
