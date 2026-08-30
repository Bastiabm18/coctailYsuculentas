"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiArrowLeft, HiUser, HiTrash, HiMinus, HiPlus } from "react-icons/hi2";

import { useCart } from "@/context/CartContext";
import { useAuth } from "../hook/useAuth";

export default function PerfilPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const { items, eliminarItem, actualizarCantidad, total, totalItems } = useCart();

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-md mx-auto pt-8 pb-20">
        {/* Volver */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-6"
        >
          <HiArrowLeft className="text-lg" />
          Volver
        </button>

        {/* Perfil */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-3xl bg-white p-8 shadow-sm text-center mb-6"
        >
          {userData.avatar ? (
            <img src={userData.avatar} alt="avatar" className="h-20 w-20 rounded-full object-cover mx-auto mb-4" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
              <HiUser className="text-3xl text-neutral-400" />
            </div>
          )}

          <p className="text-lg font-semibold text-neutral-800">
            {userData.nombre || "Sin nombre"}
          </p>
          <p className="text-sm mt-1 text-neutral-400">
            {userData.email}
          </p>
        </motion.div>

        {/* Carrito */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-neutral-800">
              Mi carrito
            </h2>
            {totalItems > 0 && (
              <span className="text-xs text-neutral-400">
                {totalItems} {totalItems === 1 ? "producto" : "productos"}
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">
              Tu carrito está vacío
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-neutral-400 capitalize">
                        {item.tienda}
                      </p>
                      <p className="text-sm font-semibold text-pastel-red mt-1">
                        ${item.precio.toLocaleString("es-CL")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-100 transition-colors"
                      >
                        <HiMinus className="text-xs" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-neutral-800">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-100 transition-colors"
                      >
                        <HiPlus className="text-xs" />
                      </button>
                    </div>

                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-sm text-neutral-400">Total</span>
                <span className="text-lg font-bold text-neutral-800">
                  ${total.toLocaleString("es-CL")}
                </span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}