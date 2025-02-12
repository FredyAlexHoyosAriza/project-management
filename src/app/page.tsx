// import NavBar from "@/components/NavBar";
import React from "react";
import Image from "next/image";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  // auth0.getSession(): este método no solo extrae el token, sino que además realiza la
  // validación, decodificación y devuelve un objeto con la información del usuario.
  const session = await auth0.getSession();
  const user = session ? session.user : null;
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
                height={0} // Dejar altura automática
                className="h-auto mx-auto mb-1"
              />
            </a>
          </li>
          <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">
            About us
          </li>
          <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">
            Contact us
          </li>
          <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">
            Mission
          </li>
          <li className="text-lg font-medium hover:scale-110 hover:text-indigo-700 cursor-pointer">
            Vision
          </li>
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
        <div className="relative w-full h-[500px]">
          <Image
            src="/Project-Management-Landing-2.jpg"
            alt="Project Management Landing"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <h1 className="flex flex-col text-2xl text-center font-bold">
              <span>Your Vision, Our Mission</span>
              <span>¡Building Success Together!</span>
            </h1>
          </div>
        </div>
      </main>
    </div>
    // <div className="container">
    //   <h1>Welcome to project Management!!</h1>
    //   <Link href={'/test'}>
    //     <Button label="Haz clic aquí" />
    //   </Link>
    // </div>
  );
}
