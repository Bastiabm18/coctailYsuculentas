"use client";

import { motion } from "framer-motion";
import { HiCalendarDays, HiStar } from "react-icons/hi2";
import type { Noticia } from "@/app/types/productos";
import { useRouter } from "next/navigation";

interface Props {
  noticia: Noticia;
  tienda: "cocteleria" | "suculentas";
  index: number;
}

/* ─── Colores por tienda ─── */
const TEMAS = {
  cocteleria: {
    tarjeta: "bg-white/80 border-pastel-pink/15 hover:border-pastel-pink/40 hover:shadow-lg hover:shadow-pastel-pink/10",
    imagenHover: "group-hover:scale-105",
    titulo: "text-pastel-brown",
    subtitulo: "text-pastel-brown/60",
    fecha: "text-pastel-brown/45",
    etiqueta: "bg-pastel-pink/20 text-pastel-pink",
    etiquetaDestacado: "bg-pastel-red/15 text-pastel-red",
    placeholder: "bg-pastel-pink/20",
    overlay: "from-pastel-peach/20",
  },
  suculentas: {
    tarjeta: "bg-terra-hover/30 border-cream/8 hover:border-cream/20 hover:shadow-lg hover:shadow-terra/10",
    imagenHover: "group-hover:scale-105",
    titulo: "text-cream",
    subtitulo: "text-cream/60",
    fecha: "text-cream/40",
    etiqueta: "bg-cream/10 text-cream/70",
    etiquetaDestacado: "bg-terra/25 text-cream",
    placeholder: "bg-terra-hover",
    overlay: "from-terra-dark/20",
  },
} as const;

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TarjetaNoticia({ noticia, tienda, index }: Props) {
  const tema = TEMAS[tienda];
  const router = useRouter();
  //console.log("noticia:", noticia);
  const { id,titulo, subtitulo, imagen_url, fecha_creacion, destacado } = noticia;

  return (
    <motion.article
      onClick={() => { router.push(`/noticia_id/${id}`) }}
      className={`group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${tema.tarjeta}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      layout
    >
      {/* ── Imagen ── */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {imagen_url ? (
          <img
            src={imagen_url}
            alt={titulo}
            className={`h-full w-full object-cover transition-transform duration-500 ${tema.imagenHover}`}
            loading="lazy"
          />
        ) : (
          <div className={`h-full w-full ${tema.placeholder}`} />
        )}

        {/* Gradiente inferior sobre la imagen */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${tema.overlay} to-transparent`}
        />

        {/* Etiqueta superpuesta */}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-sm ${
              destacado ? tema.etiquetaDestacado : tema.etiqueta
            }`}
          >
            {destacado && <HiStar className="text-xs" />}
            {destacado ? "Destacado" : "Noticia"}
          </span>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="flex flex-col gap-2 p-4 md:p-5">
        <h3
          className={`line-clamp-2 text-base font-bold leading-snug tracking-tight transition-colors md:text-lg ${tema.titulo}`}
        >
          {titulo}
        </h3>

        {subtitulo && (
          <p className={`line-clamp-2 text-sm leading-relaxed ${tema.subtitulo}`}>
            {subtitulo}
          </p>
        )}

        <div
          className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${tema.fecha}`}
        >
          <HiCalendarDays className="text-sm" />
          <time dateTime={fecha_creacion}>
            {formatearFecha(fecha_creacion)}
          </time>
        </div>
      </div>
    </motion.article>
  );
}