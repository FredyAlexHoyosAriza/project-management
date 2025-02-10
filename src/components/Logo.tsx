import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    // mx-auto
    <div className="flex flex-col w-full text-center my-2">
      <Image
        src="/project-management-1.png"
        alt="Gear Image"
        width={56} // Equivalente a w-14 en Tailwind (14 * 4 = 56px)
        height={0} // Dejar altura automática
        className="h-auto mx-auto mb-1"
      />
      <h3>Management</h3>
      {/* <div className="flex flex-col w-full text-center my-2">
      <div className="relative w-14 h-14 mx-auto">
        <Image
          src="/project-management-1.png"
          alt="Gear Image"
          fill
          className="object-contain"
        />
      </div>
      <h3>Management</h3>
    </div> */}
    </div>
  );
};

export default Logo;
