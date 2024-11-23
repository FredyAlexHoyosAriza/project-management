import Link from 'next/link';
import React from 'react'

const Test = () => {
  return (
    <Link href={'/'}>
        <h2 className="flex justify-center w-1/6 self-center mx-auto border-2 p-2 bg-blue-700 text-white">Regresar a vista anterior</h2>
    </Link>
  )
}

export default Test;