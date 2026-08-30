"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineHome, HiOutlineFire, HiOutlineSparkles, HiArrowRightOnRectangle, HiXMark, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsNewspaper } from "react-icons/bs";

interface MenuItem {
  nombre: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { nombre: "Inicio", path: "/dashboard", icon: <HiOutlineHome className="text-xl" /> },
  { nombre: "Cocteles", path: "/dashboard/cocteles", icon: <HiOutlineFire className="text-xl" /> },
  { nombre: "Suculentas", path: "/dashboard/suculentas", icon: <HiOutlineSparkles className="text-xl" /> },
  { nombre: "noticias", path: "/dashboard/noticias", icon: <BsNewspaper className="text-xl" /> },
];

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onSalir: () => void;
}

export default function DashboardSidebar({ abierto, onCerrar, onSalir }: Props) {
  const pathname = usePathname();
  const [colapsado, setColapsado] = useState(false);

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-neutral-100 flex flex-col transition-all duration-300 lg:translate-x-0 ${
          colapsado ? "w-20" : "w-64"
        } ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center border-b border-neutral-100 py-5 ${colapsado ? "justify-center px-0" : "justify-between px-6"}`}>
          {!colapsado && (
            <h1 className="text-lg font-bold text-neutral-800">Dashboard</h1>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setColapsado(!colapsado)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"
            >
              {colapsado ? <HiChevronRight className="text-lg" /> : <HiChevronLeft className="text-lg" />}
            </button>
            <button
              onClick={onCerrar}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"
            >
              <HiXMark className="text-lg" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const activo = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onCerrar}
                title={colapsado ? item.nombre : undefined}
                className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-colors ${
                  colapsado ? "justify-center px-0 py-3" : "px-4 py-3"
                } ${
                  activo
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                }`}
              >
                {item.icon}
                {!colapsado && item.nombre}
              </Link>
            );
          })}
        </nav>

        {/* Salir */}
        <div className="px-3 py-4 border-t border-neutral-100">
          <button
            onClick={onSalir}
            title={colapsado ? "Salir" : undefined}
            className={`flex items-center gap-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors ${
              colapsado ? "justify-center w-full py-3" : "w-full px-4 py-3"
            }`}
          >
            <HiArrowRightOnRectangle className="text-xl" />
            {!colapsado && "Salir"}
          </button>
        </div>
      </aside>
    </>
  );
}