"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import TarjetaNoticia from "./TarjetaNoticia";
import type { Noticia } from "@/app/types/productos";
import { obtenerNoticiasVisibles } from "@/app/actions/actions";

interface Props {
  tienda: "cocteleria" | "suculentas";
}

export default function ContenedorNoticias({ tienda }: Props) {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [index, setIndex] = useState(0);
  const [esMovil, setEsMovil] = useState(false);

  const bgFondo = tienda === "cocteleria" ? "bg-pastel-peach/50" : "bg-terra-dark";
  const bgText = tienda === "cocteleria" ? "text-pastel-brown" : "text-cream";

  useEffect(() => {
    const check = () => setEsMovil(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    obtenerNoticiasVisibles()
      .then(setNoticias)
      .catch(() => {});
  }, []);

  const maxIndex = useCallback(() => {
    if (noticias.length === 0) return 0;
    return esMovil ? noticias.length - 1 : Math.max(0, noticias.length - 2);
  }, [noticias.length, esMovil]);

  const anterior = () => setIndex((i) => Math.max(0, i - 1));
  const siguiente = () => setIndex((i) => Math.min(maxIndex(), i + 1));

  if (noticias.length === 0) return null;

  const offset = esMovil ? index * 100 : index * 50;

  return (
    <div className={`relative w-full ${bgFondo}`}>
      <motion.h2
        className={`text-center ${bgText} text-3xl font-bold tracking-tight md:text-5xl pt-5`}
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        
      >
        Noticias
      </motion.h2>

      <div className="overflow-hidden rounded-2xl p-10">
        <motion.div
          className="flex gap-4"
          animate={{ x: `-${offset}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: -maxIndex() * (esMovil ? window.innerWidth * 0.85 + 16 : window.innerWidth * 0.44 + 16), right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) siguiente();
            else if (info.offset.x > 50) anterior();
          }}
        >
          {noticias.map((n) => (
            <div key={n.id} className="flex-shrink-0 pr-4">
              <TarjetaNoticia
                titulo={n.titulo}
                subtitulo={n.subtitulo}
                imagen_url={n.imagen_url}
                tienda={tienda}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Botones PC */}
      <AnimatePresence>
        {index > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={anterior}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg border border-neutral-100 text-neutral-600 hover:bg-white hover:text-neutral-800 transition-colors"
          >
            <HiChevronLeft className="text-xl" />
          </motion.button>
        )}
        {index < maxIndex() && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={siguiente}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg border border-neutral-100 text-neutral-600 hover:bg-white hover:text-neutral-800 transition-colors"
          >
            <HiChevronRight className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Botones móvil */}
      <div className="flex md:hidden items-center justify-center gap-3 mt-4 pb-5">
        <button
          onClick={anterior}
          disabled={index === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-neutral-200 disabled:opacity-30 transition-colors"
        >
          <HiChevronLeft className="text-lg" />
        </button>
        <span className="text-xs text-neutral-200/60 min-w-[3rem] text-center">
          {index + 1} / {noticias.length}
        </span>
        <button
          onClick={siguiente}
          disabled={index >= maxIndex()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-neutral-200 disabled:opacity-30 transition-colors"
        >
          <HiChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );
}