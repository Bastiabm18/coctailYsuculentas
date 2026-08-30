"use client";

import Link from "next/link";
import { HiOutlineFire, HiOutlineSparkles, HiArrowRight, HiOutlineNewspaper } from "react-icons/hi2";

const secciones = [
  {
    nombre: "Cocteles",
    descripcion: "Gestiona los productos de coctelería",
    path: "/dashboard/cocteles",
    icon: <HiOutlineFire className="text-3xl" />,
    color: "bg-pastel-peach/20 text-pastel-red",
  },
  {
    nombre: "Suculentas",
    descripcion: "Gestiona los productos de suculentas",
    path: "/dashboard/suculentas",
    icon: <HiOutlineSparkles className="text-3xl" />,
    color: "bg-terra/20 text-terra-dark",
  },
   { nombre: "Noticias", 
    path: "/dashboard/noticias", 
    icon: <HiOutlineNewspaper className="text-xl" /> },
];

export default function DashboardHome() {
  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">Bienvenido</h1>
        <p className="text-sm text-neutral-400 mt-1">Selecciona una sección para gestionar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secciones.map((s) => (
          <Link
            key={s.path}
            href={s.path}
            className="group rounded-2xl bg-white border border-neutral-100 p-6 transition-all hover:shadow-lg hover:shadow-neutral-200/50 hover:-translate-y-0.5"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.color} mb-4`}>
              {s.icon}
            </div>
            <h3 className="text-base font-semibold text-neutral-800">{s.nombre}</h3>
            <p className="text-sm text-neutral-400 mt-1">{s.descripcion}</p>
            <div className="flex items-center gap-1 mt-4 text-sm font-medium text-neutral-400 group-hover:text-neutral-800 transition-colors">
              Ir a sección
              <HiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}