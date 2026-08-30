
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GiCactus } from "react-icons/gi";

export default function HeroSuculentas() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-terra px-6">
      {/* Círculos decorativos */}
      <motion.div
        className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full border-[50px] border-neutral-100/8"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: 1, rotate: 20 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -left-24 bottom-1/4 h-64 w-64 rounded-full border-[35px] border-neutral-100/6"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: 1, rotate: -15 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-row items-center justify-center"
        >
            <Image alt='suculentas' src='/suculentas.PNG' height={200} width={200}
              loading="eager"
              style={{ width: 'auto', height: 'auto' }}/>
        </motion.div>

        <motion.h1
          className="text-neutral-100 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Suculentas
        </motion.h1>

        <motion.p
          className="mt-6 mx-auto max-w-md text-neutral-100/60 text-base md:text-lg leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Plantas que transforman espacios con mínimo esfuerzo y máxima belleza.
          Cada una es una pieza única de la naturaleza.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <a
            href="#productos"
            className="inline-block rounded-full border border-neutral-100/30 px-8 py-3 text-sm font-medium tracking-wider uppercase text-neutral-100 transition-all hover:bg-neutral-100 hover:text-terra"
          >
            Ver plantas
          </a>
        </motion.div>
      </div>
    </section>
  );
}