"use client";

import { motion, Variants as type, Variants } from "framer-motion";
import { GiCookingPot } from "react-icons/gi";
import { useCart } from "@/context/CartContext";

const productos = [
  {
    id: "coct-1",
    nombre: "Cóctel de Camarones",
    descripcion: "Camarones frescos, salsa rosa casera, lechuga y aguacate.",
    precio: 8900,
    tag: "Más pedido",
  },
  {
    id: "coct-2",
    nombre: "Ceviche de Corvina",
    descripcion: "Corvina, limón de Pica, cebolla morada, cilantro y ají.",
    precio: 9500,
    tag: "Estrella",
  },
  {
    id: "coct-3",
    nombre: "Bruschettas Variadas",
    descripcion: "Pan cristal con tomate confitado, burrata, prosciutto y pesto.",
    precio: 6200,
    tag: null,
  },
  {
    id: "coct-4",
    nombre: "Canapés Surtidos x12",
    descripcion: "Salmón, paté de pollo, hummus y queso de cabra.",
    precio: 7800,
    tag: "Popular",
  },
  {
    id: "coct-5",
    nombre: "Tártara de Atún",
    descripcion: "Atún fresco, aguacate, sésamo tostado, soja y jengibre.",
    precio: 10200,
    tag: "Premium",
  },
  {
    id: "coct-6",
    nombre: "Empanaditas de Pino",
    descripcion: "Masa casera dorada, carne, cebolla, huevo duro y aceituna.",
    precio: 4500,
    tag: null,
  },
];

const cardVariants : Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function ProductosCocteleria() {
  const { agregarItem } = useCart();

  return (
    <section id="productos" className="bg-white px-6 py-24 md:py-32">
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
              {producto.tag && (
                <span className="absolute top-4 right-4 rounded-full bg-pastel-pink/25 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-pastel-brown">
                  {producto.tag}
                </span>
              )}

              <div className="flex h-40 items-center justify-center rounded-xl bg-pastel-red/5 transition-colors group-hover:bg-pastel-red/10">
                <GiCookingPot className="text-pastel-red/15 text-6xl transition-colors group-hover:text-pastel-red/30" />
              </div>

              <div className="mt-5">
                <h3 className="text-pastel-brown text-lg font-semibold">
                  {producto.nombre}
                </h3>
                <p className="mt-2 text-pastel-brown/45 text-sm leading-relaxed">
                  {producto.descripcion}
                </p>
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
                  className="rounded-full border border-pastel-red/25 px-5 py-2 text-xs font-medium tracking-wider uppercase text-pastel-red transition-all hover:bg-pastel-red hover:text-white"
                >
                  Pedir
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}