"use client";

import { motion } from "framer-motion";
import { GiCookingPot, GiFruitBowl, GiMeal } from "react-icons/gi";

const valores = [
  {
    icono: <GiMeal className="text-2xl" />,
    titulo: "Ingredientes de mercado",
    texto: "Compramos en ferias locales cada mañana. Nada congelado, nada de sala.",
  },
  {
    icono: <GiCookingPot className="text-2xl" />,
    titulo: "Cocina artesanal",
    texto: "Cada pieza se prepara a mano. Salsas caseras, masas hechas en el día.",
  },
  {
    icono: <GiFruitBowl className="text-2xl" />,
    titulo: "Presentación cuidada",
    texto: "Que se vea tan bien que da pena comerlo. Casi.",
  },
];

export default function NosotrosCocteleria() {
  return (
    <section className="bg-pastel-peach px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="text-center text-pastel-brown text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Quiénes somos
        </motion.h2>

        <motion.p
          className="mt-6 mx-auto max-w-2xl text-center text-pastel-brown/55 text-base md:text-lg leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Somos un equipo de cocina especializado en coctelería de comida para
          eventos. Empezamos haciendo canapés para cumpleaños de amigos y
          hoy montamos barras completas para matrimonios, corporativos y
          reuniones privadas.
        </motion.p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {valores.map((valor, i) => (
            <motion.div
              key={valor.titulo}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-2xl border border-pastel-brown/8 bg-white p-8 text-center"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-pastel-pink/25 text-pastel-red">
                {valor.icono}
              </div>
              <h3 className="text-pastel-brown text-lg font-semibold">
                {valor.titulo}
              </h3>
              <p className="mt-3 text-pastel-brown/45 text-sm leading-relaxed">
                {valor.texto}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}