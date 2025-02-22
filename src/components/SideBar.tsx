"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import { ReactNode } from "react";
import Link from "next/link";
import useActiveRoute from "@/hooks/useActiveRoute";

// Tipos explícitos para las props
// href: string; Ruta a la que apunta el enlace
// label?: ReactNode; Contenido del enlace (texto o JSX)
// className?: string; Clase CSS opcional

type CustomNavLinkProps =
  | { href: string; icon: string; label?: never; className?: string }
  | { href: string; label: ReactNode; icon?: never; className?: string };

const CustomNavLink = (props: CustomNavLinkProps) => {
  const { href, className = "link" } = props;
  const isActive = useActiveRoute(href); // Determina si la ruta es activa

  return (
    <Link
      href={`/admin/${href}`}
      className={`${className} ${isActive ? "active" : ""}`}
    >
      {props.icon ? (
        <>
          <i className={`fas fa-${props.icon} mr-2`} />
          {`${href.charAt(0).toUpperCase() + href.slice(1)}`}
        </>
      ) : (
        props.label
      )}
    </Link>
  );
};

const Logout = () => {
  return (
    <a
      href="/auth/logout"
      className="bg-slate-500 w-2/3 self-center p-2 border border-slate-900 text-white text-center rounded-lg shadow-md hover:scale-110 hover:bg-slate-700"
    >
      Log out
    </a>
  );
};

const SideBar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTransitionEnd = () => {
      setIsAnimating(false);
  };

  const handleMenu = () => {
    setIsAnimating(true);
    if (showSidebar) setShowSidebar(false);
    else setTimeout(() => setShowSidebar(true), 0);
    //Se agrega setTimeOut para dar tiempo al cambio de clase de hidden a -translate-x-full; tal que pueda
    //ocurrir la transición del sidebar de cerrado a abierto entre 2 estados no ocultos; -x-full y x-0
    // Usamos setTimeout con tiempo 0 para diferir el cambio de estado. 
    // Esto permite que React primero procese la transición de clases (-translate-x-full) 
    // antes de mostrar el menú (translate-x-0), asegurando que las transiciones funcionen correctamente.
  };

  return (
    <div className="relative md:static">
      {/* Barra superior para dispositivos pequeños */}
      <div className="md:hidden flex w-full justify-between bg-gray-800 p-2 text-white">
        <button
          aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
          className={`fas fa-${showSidebar ? "times" : "bars"}`}
          onClick={handleMenu}
        />
        <Link href={"/"}>
          <i className="fas fa-home" title="Home" />
        </Link>
      </div>

      {/* Menú lateral */}
      <nav
        className={`${
          showSidebar
          ? "translate-x-0"
          : isAnimating
          ? "-translate-x-full"
          : "hidden"
        } menu sm:absolute top-10 md:top-0 md:static md:block transition-transform duration-300 ease-in-out`}
        onTransitionEnd={handleTransitionEnd}
        // Usamos aria-hidden para mejorar accesibilidad
        aria-hidden={!showSidebar}
        // No usamos hidden en la apertura del menú, solo al cerrarlo
        // hidden={!showSidebar && !isAnimating}
      >
        <ul className="menu__list">
          <CustomNavLink href="" label={<Logo />} />
          <CustomNavLink href="profile" icon="user" />
          <CustomNavLink href="users" icon="users" />
          <CustomNavLink href="projects" icon="university" />
          <CustomNavLink href="enrollments" icon="mug-hot" />
          <CustomNavLink href="advances" icon="trailer" />
          <Logout />
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;

