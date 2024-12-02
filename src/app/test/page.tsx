import Link from 'next/link';
import React from 'react'
import type { Metadata } from "next";

// Poner metadata para cada page es buena práctica en cuanto a SEO
export const metadata: Metadata = {
  title: "Test | Project Management",
  description: "Página de prueba para la gestión de proyectos.",
};

const Test = () => {
  return (
    <Link href={'/'}>
      <div className='flex'>
        <h2 className="flex justify-center w-1/6 mx-auto border-2 p-2 bg-blue-700 text-white font-bold"><i className="fas fa-home self-center mr-2" />Regresar al home</h2>
      </div>
    </Link>
  )
}

export default Test;