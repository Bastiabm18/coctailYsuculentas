"use client";

import { motion, type Variants } from "framer-motion";
import { GiCactus } from "react-icons/gi";
import { useCart } from "@/context/CartContext";

const productos =  [
  {
    id: "sucul-1",
    nombre: "Echeveria Elegans",
    descripcion: "Roseta perfecta de tonos azulados. Ideal para escritorios.",
    precio: 4500,
    tag: "Más vendida",
  },
  {
    id: "sucul-2",
    nombre: "Aloe Vera",
    descripcion: "Clásica y medicinal. Resistente y de crecimiento rápido.",
    precio: 5200,
    tag: null,
  },
  {
    id: "sucul-3",
    nombre: "Crassula Ovata",
    descripcion: "Árbol de jade. Símbolo de prosperidad y buena suerte.",
    precio: 6800,
    tag: "Nova",
  },
  {
    id: "sucul-4",
    nombre: "Haworthia Fasciata",
    descripcion: "Líneas blancas sobre verde oscuro. Pequeña y elegante.",
    precio: 3900,
    tag: null,
  },
  {
    id: "sucul-5",
    nombre: "Sedum Morganianum",
    descripcion: "Cola de burro. Cuelga hermosa de macetas colgantes.",
    precio: 5400,
    tag: "Popular",
  },
  {
    id: "sucul-6",
    nombre: "Sempervivum Tectorum",
    descripcion: "Siempreviva. Sobrevive extremos y cambia de color.",
    precio: 3200,
    tag: null,
  },
];

const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};




export default function ProductosSuculentas() {
   const { agregarItem } = useCart();
  return (
    <section id="productos" className="bg-terra-dark px-6 py-24 md:py-32">
      {/* bg-terra-dark no existe en tailwind por defecto, lo agregamos abajo */}
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-neutral-100 text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Nuestras plantas
        </motion.h2>

        <motion.p
          className="mt-4 text-center text-neutral-100/50 text-sm md:text-base"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Selección cuidada especie por especie
        </motion.p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, i) => (
            <motion.article
              key={producto.nombre}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="group relative rounded-2xl border border-neutral-100/10 bg-terra p-6 transition-all hover:border-neutral-100/25 hover:shadow-2xl hover:shadow-black/20"
            >
              {/* Tag */}
              {producto.tag && (
                <span className="absolute top-4 right-4 rounded-full bg-neutral-100/15 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-neutral-100">
                  {producto.tag}
                </span>
              )}

              {/* Imagen placeholder con ícono */}
              <div className="flex h-40 items-center justify-center rounded-xl bg-neutral-100/5 transition-colors group-hover:bg-neutral-100/10">
                <GiCactus className="text-neutral-100/20 text-6xl transition-colors group-hover:text-neutral-100/35" />
              </div>

              {/* Info */}
              <div className="mt-5">
                <h3 className="text-neutral-100 text-lg font-semibold">
                  {producto.nombre}
                </h3>
                <p className="mt-2 text-neutral-100/50 text-sm leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>

              {/* Precio + Botón */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-neutral-100 text-xl font-bold">
                  ${producto.precio.toLocaleString("es-CL")}
                </span>
                <button 
                 onClick={() =>
                    agregarItem({
                      id: producto.id,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      tienda: "suculentas",
                    })
                  }
                  className="rounded-full border border-neutral-100/25 px-5 py-2 text-xs font-medium tracking-wider uppercase text-neutral-100 transition-all hover:bg-neutral-100 hover:text-terra">
                  Agregar
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}