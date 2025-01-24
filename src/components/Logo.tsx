import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    // mx-auto
    <div className="flex flex-col w-full text-center my-2">
      {/* <Image src='/project-management-1.png' alt='Img Concesionario' className='w-14 h-auto mx-auto mb-1' /> */}
      <Image
        src="/project-management-1.png"
        alt="Img Concesionario"
        width={56} // Equivalente a `w-14`
        height={0} // `h-auto` se maneja configurando solo el ancho.
        style={{ margin: "0 auto", marginBottom: "0.25rem" }} // `mx-auto mb-1`
      />
      <h3>Project Management</h3>
    </div>
  );
};

export default Logo;
