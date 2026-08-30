"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineBars3, HiArrowRightOnRectangle, HiXMark } from "react-icons/hi2";
import DashboardSidebar from "./DashboardSidebar";
import { useAuth } from "@/app/hook/useAuth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { cerrarSesion } = useAuth();
  const router = useRouter();

  const salir = async () => {
    await cerrarSesion();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar móvil overlay */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      <DashboardSidebar
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
        onSalir={salir}
      />

      {/* Contenido principal */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 lg:ml-64`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4">
          <button
            onClick={() => setSidebarAbierto(true)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            {sidebarAbierto ? <HiXMark className="text-xl" /> : <HiOutlineBars3 className="text-xl" />}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={salir}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <HiArrowRightOnRectangle className="text-lg" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}