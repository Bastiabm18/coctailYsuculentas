"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowLeft, HiShoppingBag } from "react-icons/hi2";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/app/hook/useAuth";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";


interface NavbarProps {
  tema: "cocteleria" | "suculentas";
}

export default function Navbar({ tema }: NavbarProps) {
  const esCocteleria = tema === "cocteleria";
  const { totalItems, abrir } = useCart();
  const { avatar, cerrarSesion } = useAuth();
  const [authAbierto, setAuthAbierto] = useState(false);

  const coloresTexto = esCocteleria
    ? "text-pastel-brown hover:bg-pastel-brown/10"
    : "text-neutral-100 hover:bg-neutral-100/10";

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b ${
          esCocteleria
            ? "bg-pastel-peach/80 border-pastel-brown/10"
            : "bg-terra/80 border-neutral-100/10"
        }`}
      >
        <Link
          href="/"
          className={`flex items-center gap-2 text-sm font-semibold tracking-wide uppercase transition-colors ${
            esCocteleria
              ? "text-pastel-brown hover:text-pastel-red"
              : "text-neutral-100 hover:text-neutral-100/70"
          }`}
        >
          <HiArrowLeft className="text-lg" />
          <span className="hidden sm:inline">Bitienda</span>
        </Link>

        <span
          className={`text-xs font-medium tracking-widest uppercase ${
            esCocteleria ? "text-pastel-brown/40" : "text-neutral-100/50"
          }`}
        >
          {esCocteleria ? "Candy happy family" : "Suculentas"}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={abrir}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${coloresTexto}`}
          >
            <HiShoppingBag className="text-xl" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pastel-red px-1 text-[10px] font-bold text-white"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          <UserMenu
            tema={tema}
            onAbrirAuth={() => setAuthAbierto(true)}
          />
        </div>
      </motion.nav>

      {authAbierto && <AuthModal onCerrar={() => setAuthAbierto(false)} />}
    </>
  );
}