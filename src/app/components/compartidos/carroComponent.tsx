"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiMinus, HiPlus, HiTrash, HiShoppingBag } from "react-icons/hi2";
import { useCart } from "@/context/CartContext";

export default function CarroComponent() {
  const {
    items,
    abierto,
    cerrar,
    actualizarCantidad,
    eliminarItem,
    limpiarCarrito,
    total,
    totalItems,
  } = useCart();

  const vacio = items.length === 0;

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm md:bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
          />

          <motion.aside
            className="fixed top-0 right-0 bottom-0 z-[95] flex flex-col bg-white/90 rounded-2xl shadow-2xl w-full md:w-[420px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <div>
                <h2 className="text-neutral-800 text-lg font-bold">Tu carrito</h2>
                <p className="text-neutral-400 text-xs mt-0.5">
                  {totalItems} {totalItems === 1 ? "producto" : "productos"}
                </p>
              </div>
              <button
                onClick={cerrar}
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {vacio ? (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <HiShoppingBag className="text-neutral-300 text-2xl" />
                  </div>
                  <p className="text-neutral-400 text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 rounded-xl border border-neutral-100 p-4"
                    >
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-xl ${
                          item.tienda === "cocteleria"
                            ? "bg-pastel-peach text-pastel-red"
                            : "bg-terra/10 text-terra"
                        }`}
                      >
                        {item.tienda === "cocteleria" ? "🍽" : "🌵"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-neutral-800 text-sm font-semibold truncate">
                          {item.nombre}
                        </h4>
                        <p
                          className={`text-[10px] font-medium uppercase tracking-wider mt-0.5 ${
                            item.tienda === "cocteleria"
                              ? "text-pastel-red/60"
                              : "text-terra/60"
                          }`}
                        >
                          {item.tienda === "cocteleria" ? "Coctelería" : "Suculentas"}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-700"
                            >
                              <HiMinus className="text-xs" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-neutral-700">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-700"
                            >
                              <HiPlus className="text-xs" />
                            </button>
                          </div>
                          <span className="text-neutral-800 text-sm font-bold">
                            ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="self-start flex h-7 w-7 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <HiTrash className="text-sm" />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {!vacio && (
              <div className="border-t border-neutral-100 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-sm">Total</span>
                  <span className="text-neutral-800 text-xl font-bold">
                    ${total.toLocaleString("es-CL")}
                  </span>
                </div>
                <button className="w-full rounded-xl bg-pastel-red py-3.5 text-sm font-semibold text-white transition-all hover:bg-pastel-red-hover hover:shadow-lg hover:shadow-pastel-red/20">
                  Ir a pagar
                </button>
                <button
                  onClick={limpiarCarrito}
                  className="w-full text-neutral-400 text-xs hover:text-red-500 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}