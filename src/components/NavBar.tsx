"use client";

import Image from "next/image";
import Link from "next/link";
// import concessionaireLogo from '@/public/concesionario-de-coches.png';

const NavBar = () => {
  return (
    <nav className="bg-red-300 shadow-md">
      <ul className="flex justify-between items-center my-4 px-4">
        <li>
          <Link href="/" className="hover:scale-110">
          <Image 
            src="/project-management-1.png"
            alt="Gear Image"
            width={56}  // w-14 equivale a 56px
            height={56} // Puedes ajustar o eliminar para mantener la proporción automática
            className="mx-auto mb-1"
          />
          </Link>
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
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
