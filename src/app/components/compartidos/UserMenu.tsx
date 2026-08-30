"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiUser } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hook/useAuth";

interface UserMenuProps {
  tema: "cocteleria" | "suculentas";
  onAbrirAuth: () => void;
}

export default function UserMenu({ tema, onAbrirAuth }: UserMenuProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const router = useRouter();
  const { userData, avatar, cerrarSesion } = useAuth();
  const esCocteleria = tema === "cocteleria";

  const coloresBoton = esCocteleria
    ? "text-pastel-brown hover:bg-pastel-brown/10"
    : "text-neutral-100 hover:bg-neutral-100/10";

  const handleClick = () => {
    if (userData) {
      setMenuAbierto(!menuAbierto);
    } else {
      onAbrirAuth();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${coloresBoton}`}
      >
        {avatar ? (
          <img src={avatar} alt="avatar" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <HiUser className="text-xl" />
        )}
      </button>

      <AnimatePresence>
        {menuAbierto && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuAbierto(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border shadow-lg ${
                esCocteleria
                  ? "border-pastel-brown/10 bg-white"
                  : "border-neutral-800 bg-neutral-900"
              }`}
            >
              <button
                onClick={() => {
                  setMenuAbierto(false);
                  router.push("/perfil");
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  esCocteleria
                    ? "text-pastel-brown hover:bg-pastel-brown/5"
                    : "text-neutral-100 hover:bg-neutral-800"
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => {
                  setMenuAbierto(false);
                  cerrarSesion();
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  esCocteleria
                    ? "text-red-500 hover:bg-red-50"
                    : "text-red-400 hover:bg-red-500/10"
                }`}
              >
                Salir
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}