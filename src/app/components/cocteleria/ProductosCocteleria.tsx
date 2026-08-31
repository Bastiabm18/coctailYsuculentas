"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { GiCookingPot } from "react-icons/gi";
import { useCart } from "@/context/CartContext";
import type { Producto } from "@/app/types/productos";
import { obtenerCoctelesVisibles } from "@/app/actions/actions";
import { PiChartLineDownLight } from "react-icons/pi";
import { MdAddShoppingCart } from "react-icons/md";

const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function ProductosCocteleria() {
  const { agregarItem } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    obtenerCoctelesVisibles().then(setProductos).catch(() => {});
  }, []);

  return (
    <section id="productos" className="bg-pastel-peach/60 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-pastel-brown text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Nuestro menú
        </motion.h2>

        <motion.p
          className="mt-4 text-center text-pastel-brown/45 text-sm md:text-base"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Todo preparado el mismo día, con ingredientes de mercado
        </motion.p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, i) => (
            <motion.article
              key={producto.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="group relative rounded-2xl border border-pastel-brown/8 bg-pastel-peach/40 p-6 transition-all hover:border-pastel-red/20 hover:shadow-xl hover:shadow-pastel-red/6"
            >
              {producto.tipo && (
                <span className="absolute top-4 right-4 rounded-full bg-pastel-pink/25 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-pastel-brown">
                  {producto.tipo}
                </span>
              )}

              <div className="flex h-40 items-center justify-center rounded-xl bg-pastel-red/5 transition-colors group-hover:bg-pastel-red/10 overflow-hidden">
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <GiCookingPot className="text-pastel-red/15 text-6xl transition-colors group-hover:text-pastel-red/30" />
                )}
              </div>

              <div className="mt-5">
                <h3 className="text-pastel-brown text-lg font-semibold">
                  {producto.nombre}
                </h3>
                {producto.descripcion && (
                  <p className="mt-2 text-pastel-brown/45 text-sm leading-relaxed line-clamp-2">
                    {producto.descripcion}
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-pastel-brown text-xl font-bold">
                  ${producto.precio.toLocaleString("es-CL")}
                </span>
                <button
                  onClick={() =>
                    agregarItem({
                      id: producto.id,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      tienda: "cocteleria",
                    })
                  }
                  className="rounded-full flex flex-row border border-pastel-red/25 px-5 py-2 text-xs font-medium tracking-wider uppercase text-pastel-red transition-all hover:bg-pastel-red hover:text-white"
                >
                  Añadir <MdAddShoppingCart />

                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}