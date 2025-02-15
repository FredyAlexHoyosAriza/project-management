// import NavBar from "@/components/NavBar";
import React from "react";
import Image from "next/image";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  // auth0.getSession(): este método no solo extrae el token, sino que además realiza la
  // validación, decodificación y devuelve un objeto con la información del usuario.
  const session = await auth0.getSession();
  const user = session ? session.user : null;
  // type UserProfile = typeof user;
  // console.log("session: ", session);
  return (
    <div className="flex flex-col h-screen justify-around">
      {/* <NavBar /> */}
      <nav className="bg-red-300 shadow-md">
        <ul className="flex justify-around flex-wrap items-center my-4 px-4">
          <li>
            <a href={user ? "/admin" : "/"} className="hover:scale-110">
              <Image
                src="/project-management-1.png"
                alt="Gear Image"
                width={56} // Equivalente a w-14 en Tailwind (14 * 4 = 56px)
                height={56} // Dejar altura automática
                className="h-auto mx-auto mb-1"
              />
            </a>
          </li>
          <Li label='About us'/>
          <Li label='Contact us'/>
          <Li label='Mission'/>
          <Li label='Vision'/>
          <li className="p-2">
            {!user ? (
              <div>
                <a
                  href="/auth/login?screen_hint=signup"
                  className="m-1 bg-indigo-500 p-2 border border-sky-900 text-white rounded-lg shadow-md hover:scale-110 hover:bg-indigo-900"
                >
                  Sign up
                </a>
                <a
                  href="/auth/login"
                  className="m-1 bg-indigo-500 p-2 border border-sky-900 text-white rounded-lg shadow-md hover:scale-110 hover:bg-indigo-900"
                >
                  Log in
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-indigo-700 font-medium">
                  Hola{`, ${user.name}`}
                </span>
                <a
                  href="/auth/logout"
                  className="bg-slate-500 p-2 border border-slate-900 text-white rounded-lg shadow-md hover:scale-110 hover:bg-slate-700"
                >
                  Log out
                </a>
              </div>
            )}
          </li>
        </ul>
      </nav>
      <main className="h-screen overflow-y-scroll bg-blue-400">
        <div className="relative w-full h-screen">
          <Image
            src="/Project-Management-Landing-2.jpg"
            alt="Project Management Landing"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <h1 className="text-2xl text-center font-bold">
              <div>Your Vision, Our Mission</div>
              <div>¡Building Success Together!</div>
            </h1>
          </div>
        </div>
      </main>
    </div>
    //  h-[500px]
  );
}

const Li = ({ label }: { label: string }) => {
  return (
    <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">
      {label}
    </li>
  );
};

