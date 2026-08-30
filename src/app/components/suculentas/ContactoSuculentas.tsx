"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { HiEnvelope, HiMapPin, HiPhone } from "react-icons/hi2";

const contactoInfo = [
  { icono: <HiEnvelope className="text-xl" />, texto: "Coctelysuculentas@gmail.com" },
  { icono: <HiPhone className="text-xl" />, texto: "+56 9 1234 5678" },
  { icono: <HiMapPin className="text-xl" />, texto: "Penco, BíoBío, Chile" },
];

export default function ContactoSuculentas() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica de Supabase después
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <section className="bg-terra-dark px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="text-center text-neutral-100 text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Hablemos
        </motion.h2>

        <motion.p
          className="mt-4 text-center text-neutral-100/50 text-sm md:text-base"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Pedidos especiales, consultas de cuidado o lo que necesites
        </motion.p>

        <div className="mt-16 grid gap-12 md:grid-cols-5">
          {/* Info de contacto */}
          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            {contactoInfo.map((item) => (
              <div key={item.texto} className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100/10 text-neutral-100">
                  {item.icono}
                </div>
                <span className="text-neutral-100/70 text-sm">{item.texto}</span>
              </div>
            ))}
          </motion.div>

          {/* Formulario */}
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
                className="w-full rounded-xl border border-neutral-100/15 bg-terra px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-100/30 outline-none transition-colors focus:border-neutral-100/40"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-xl border border-neutral-100/15 bg-terra px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-100/30 outline-none transition-colors focus:border-neutral-100/40"
              />
            </div>
            <textarea
              placeholder="Tu mensaje..."
              rows={4}
              required
              className="w-full rounded-xl border border-neutral-100/15 bg-terra px-5 py-3 text-sm text-neutral-100 placeholder:text-neutral-100/30 outline-none transition-colors resize-none focus:border-neutral-100/40"
            />
            <button
              type="submit"
              className="rounded-full bg-neutral-100 px-8 py-3 text-sm font-semibold tracking-wider uppercase text-terra transition-all hover:bg-neutral-100/90 hover:shadow-lg hover:shadow-black/20"
            >
              {enviado ? "¡Enviado!" : "Enviar mensaje"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}