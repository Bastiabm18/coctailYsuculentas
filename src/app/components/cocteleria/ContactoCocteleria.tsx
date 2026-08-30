"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { HiEnvelope, HiMapPin, HiPhone } from "react-icons/hi2";

const contactoInfo = [
  { icono: <HiEnvelope className="text-xl" />, texto: "Coctelysuculentas@gmail.com" },
  { icono: <HiPhone className="text-xl" />, texto: "+56 9 1234 5678" },
  { icono: <HiMapPin className="text-xl" />, texto: "Penco, BíoBío, Chile" },
];

export default function ContactoCocteleria() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <section className="bg-white px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="text-center text-pastel-brown text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Cotiza tu evento
        </motion.h2>

        <motion.p
          className="mt-4 text-center text-pastel-brown/45 text-sm md:text-base"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Matrimonios, corporativos, cumpleaños o lo que necesites
        </motion.p>

        <div className="mt-16 grid gap-12 md:grid-cols-5">
          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            {contactoInfo.map((item) => (
              <div key={item.texto} className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pastel-pink/25 text-pastel-red">
                  {item.icono}
                </div>
                <span className="text-pastel-brown/65 text-sm">{item.texto}</span>
              </div>
            ))}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="md:col-span-3 space-y-5"
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nombre"
                required
                className="w-full rounded-xl border border-pastel-brown/12 bg-pastel-peach/30 px-5 py-3 text-sm text-pastel-brown placeholder:text-pastel-brown/30 outline-none transition-colors focus:border-pastel-red/40"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-xl border border-pastel-brown/12 bg-pastel-peach/30 px-5 py-3 text-sm text-pastel-brown placeholder:text-pastel-brown/30 outline-none transition-colors focus:border-pastel-red/40"
              />
            </div>
            <textarea
              placeholder="Tipo de evento, cantidad de personas, fecha aproximada..."
              rows={4}
              required
              className="w-full rounded-xl border border-pastel-brown/12 bg-pastel-peach/30 px-5 py-3 text-sm text-pastel-brown placeholder:text-pastel-brown/30 outline-none transition-colors resize-none focus:border-pastel-red/40"
            />
            <button
              type="submit"
              className="rounded-full bg-pastel-red px-8 py-3 text-sm font-semibold tracking-wider uppercase text-white transition-all hover:bg-pastel-red-hover hover:shadow-lg hover:shadow-pastel-red/25"
            >
              {enviado ? "¡Enviado!" : "Solicitar cotización"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}