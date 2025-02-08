import React from "react";

const Logo = () => {
  return (
    // mx-auto
    <div className="flex flex-col w-full text-center my-2">
      {/* <Image src='/project-management-1.png' alt='Img Concesionario' className='w-14 h-auto mx-auto mb-1' /> */}
      <img
        src="/project-management-1.png"
        alt="Img Concesionario"
        className="w-14 h-auto mx-auto mb-1"
      />
      <h3>Management</h3>
    </div>
  );
};

export default Logo;
