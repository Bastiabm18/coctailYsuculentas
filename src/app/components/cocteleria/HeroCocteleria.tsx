"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GiCookingPot } from "react-icons/gi";

export default function HeroCocteleria() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-pastel-peach px-6">
      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full border-[50px] border-pastel-red/8"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: 1, rotate: -20 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-64 w-64 rounded-full border-[35px] border-pastel-pink/12"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: 1, rotate: 15 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-row items-center justify-center"
        >
          <Image alt='coctail' src='/GAMA PASTEL.PNG' height={200} width={200}/>
        </motion.div>

        <motion.h1
          className="text-pastel-brown text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Coctelería
        </motion.h1>

        <motion.p
          className="mt-6 mx-auto max-w-md text-pastel-brown/55 text-base md:text-lg leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Canapés, ceviches, bruschettas y bocados artesanales
          preparados con ingredientes frescos para tu evento.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <a
            href="#productos"
            className="inline-block rounded-full border border-pastel-red/30 px-8 py-3 text-sm font-medium tracking-wider uppercase text-pastel-red transition-all hover:bg-pastel-red hover:text-white"
          >
            Ver menú
          </a>
        </motion.div>
      </div>
    </section>
  );
}