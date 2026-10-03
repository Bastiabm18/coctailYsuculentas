"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineNewspaper, HiArrowRight } from "react-icons/hi2";
import type { Noticia } from "@/app/types/productos";
import { obtenerNoticiasVisibles } from "@/app/actions/actions";

interface Props {
  tienda: "cocteleria" | "suculentas";
}

/* ─── Colores por tienda (clases completas para que Tailwind las detecte) ─── */
const TEMAS = {
  cocteleria: {
    fondo: "bg-pastel-peach",
    titulo: "text-pastel-brown",
    subtitulo: "text-pastel-brown/80",
    contenido: "text-pastel-brown/90",
    etiqueta: "bg-pastel-pink/30 text-pastel-brown",
    boton: "bg-pastel-red text-white hover:bg-pastel-red-hover",
    placeholder: "bg-pastel-pink/30",
  },
  suculentas: {
    fondo: "bg-terra-dark",
    titulo: "text-cream",
    subtitulo: "text-cream/80",
    contenido: "text-cream/90",
    etiqueta: "bg-cream/15 text-cream",
    boton: "bg-cream text-terra hover:bg-cream/90",
    placeholder: "bg-terra-hover",
  },
} as const;

export default function ContenedorNoticias({ tienda }: Props) {
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const tema = TEMAS[tienda];

  useEffect(() => {
    obtenerNoticiasVisibles()
      .then((noticias) => {
        setNoticia(noticias[0] ?? null);
      })
      .catch(() => {});
  }, []);

  if (!noticia) return null;

  const { titulo, subtitulo, contenido, imagen_url } = noticia;

  return (
    // pt-24 / md:pt-28 = alto del menú flotante: ajústalo para que la imagen calce justo debajo
    <section
      className={`relative flex w-full flex-col items-center justify-evenly gap-10 pt-24 md:min-h-[85vh] md:flex-row md:items-stretch md:gap-0 md:pt-28 ${tema.fondo}`}
    >
      {/* ===== Izquierda: textos ===== */}
      <motion.div
        className="flex w-full flex-col justify-center gap-4 px-6 pb-10 md:w-[45%] md:gap-6 md:px-0 md:py-14"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span
          className={`flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase md:text-sm ${tema.etiqueta}`}
        >
          <HiOutlineNewspaper className="text-base" />
          Última noticia
        </span>

        <h2
          className={`text-3xl font-bold leading-tight tracking-tight md:text-5xl ${tema.titulo}`}
        >
          {titulo}
        </h2>

        {subtitulo && (
          <p className={`text-base font-medium md:text-xl ${tema.subtitulo}`}>
            {subtitulo}
          </p>
        )}

        {contenido && (
          <p
            className={`whitespace-pre-line text-sm leading-relaxed md:text-base ${tema.contenido}`}
          >
            {contenido}
          </p>
        )}

        <a
          href="/noticias"
          className={`group mt-2 flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors ${tema.boton}`}
        >
          Ver más noticias
          <HiArrowRight className="transition-transform group-hover:translate-x-1" />
        </a>
      </motion.div>

      {/* ===== Derecha: imagen ===== */}
      <motion.div
        className="relative h-[50vh] w-full overflow-hidden md:h-auto md:w-[45%]"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {imagen_url ? (
          <motion.img
            src={imagen_url}
            alt={titulo}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ) : (
          <div className={`absolute inset-0 ${tema.placeholder}`} />
        )}
      </motion.div>
    </section>
  );
}