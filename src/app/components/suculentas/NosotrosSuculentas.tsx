"use client";

import { motion } from "framer-motion";
import { GiCactus, GiSprout, GiPlantSeed } from "react-icons/gi";

const valores = [
  {
    icono: <GiPlantSeed className="text-2xl" />,
    titulo: "Origen controlado",
    texto: "Cada planta viene de viveros certificados, sin extracción del entorno natural.",
  },
  {
    icono: <GiSprout className="text-2xl" />,
    titulo: "Cuidado personalizado",
    texto: "Te guiamos con fichas de cuidado para que tu suculenta viva años.",
  },
  {
    icono: <GiCactus className="text-2xl" />,
    titulo: "Variedades únicas",
    texto: "Buscamos especies poco comunes para coleccionistas y curiosos.",
  },
];

export default function NosotrosSuculentas() {
  return (
    <section className="bg-terra px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="text-center text-neutral-100 text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Quiénes somos
        </motion.h2>

        <motion.p
          className="mt-6 mx-auto max-w-2xl text-center text-neutral-100/60 text-base md:text-lg leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Somos un pequeño vivero urbano obsesionado con las suculentas.
          Empezamos como hobby en un balcón y hoy cultivamos más de 40 especies
          distintas en nuestro taller. Creemos que una planta bien elegida
          transforma cualquier rincón.
        </motion.p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {valores.map((valor, i) => (
            <motion.div
              key={valor.titulo}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-2xl border border-neutral-100/10 bg-terra-dark p-8 text-center"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100/10 text-neutral-100">
                {valor.icono}
              </div>
              <h3 className="text-neutral-100 text-lg font-semibold">
                {valor.titulo}
              </h3>
              <p className="mt-3 text-neutral-100/50 text-sm leading-relaxed">
                {valor.texto}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}