"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiOutlineNewspaper,
  HiCalendarDays,
  HiStar,
} from "react-icons/hi2";
import type { Noticia } from "@/app/types/productos";
import { obtenerNoticiaPorId } from "@/app/actions/actions";
import Navbar from "@/app/components/compartidos/navbar";

/* ─── Colores por tienda ─── */
const TEMAS = {
  cocteleria: {
    fondo: "bg-pastel-peach",
    titulo: "text-pastel-brown",
    subtitulo: "text-pastel-brown/80",
    contenido: "text-pastel-brown/90",
    etiqueta: "bg-pastel-pink/30 text-pastel-brown",
    etiquetaDestacado: "bg-pastel-red/15 text-pastel-red",
    botonVolver: "text-pastel-brown/70 hover:text-pastel-red",
    fecha: "text-pastel-brown/50",
    placeholder: "bg-pastel-pink/30",
    contenedor: "shadow-[0_8px_40px_rgba(109,59,36,0.08)]",
    spinner: "border-pastel-pink",
  },
  suculentas: {
    fondo: "bg-terra-dark",
    titulo: "text-cream",
    subtitulo: "text-cream/80",
    contenido: "text-cream/90",
    etiqueta: "bg-cream/15 text-cream",
    etiquetaDestacado: "bg-terra/25 text-cream",
    botonVolver: "text-cream/60 hover:text-cream",
    fecha: "text-cream/40",
    placeholder: "bg-terra-hover",
    contenedor: "shadow-[0_8px_40px_rgba(0,0,0,0.2)]",
    spinner: "border-cream",
  },
} as const;

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ═══════════════════════════════════════════════════════════════
   Contenido principal
   ═══════════════════════════════════════════════════════════════ */
function NoticiaDetalleContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const tienda = (
    searchParams.get("tienda") === "suculentas" ? "suculentas" : "cocteleria"
  ) as "cocteleria" | "suculentas";
  const tema = TEMAS[tienda];

  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;
    obtenerNoticiaPorId(id)
      .then((data) => {
        setNoticia(data);
        setCargando(false);
      })
      .catch(() => {
        setNoticia(null);
        setCargando(false);
      });
  }, [id]);

  /* ─── Cargando ─── */
  if (cargando) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${tema.fondo}`}
      >
        <div
          className={`h-10 w-10 animate-spin rounded-full border-[3px] border-t-transparent ${tema.spinner}`}
        />
      </main>
    );
  }

  /* ─── No encontrada ─── */
  if (!noticia) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${tema.fondo}`}
      >
        <div className="flex flex-col items-center gap-5">
          <HiOutlineNewspaper className={`text-5xl opacity-25 ${tema.titulo}`} />
          <p className={`text-lg font-semibold ${tema.subtitulo}`}>
            Noticia no encontrada
          </p>
          <button
            onClick={() => router.back()}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${tienda === "cocteleria" ? "bg-pastel-red text-white hover:bg-pastel-red-hover" : "bg-cream text-terra hover:bg-cream/90"}`}
          >
            Volver
          </button>
        </div>
      </main>
    );
  }

  const { titulo, subtitulo, contenido, imagen_url, fecha_creacion, destacado } =
    noticia;

  /* ═══════════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════════ */
  return (
    <>
    <Navbar tema="cocteleria"/>
    <main
      className={`flex min-h-screen pt-20 items-center justify-center ${tema.fondo}`}
    >
      <motion.div
      
        className={`relative flex w-full flex-col overflow-hidden md:h-auto md:w-[85vw] md:flex-row md:rounded-3xl ${tema.contenedor}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* ═══════════ Izquierda: textos ═══════════ */}
        <motion.div
          className={`flex h-full w-full flex-col gap-5  px-6 py-10 md:w-[45%] md:px-10 md:py-8`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* ── Botón volver ── */}
          <button
            onClick={() => router.back()}
            className={`flex w-fit items-center gap-2 text-sm font-medium transition-colors ${tema.botonVolver}`}
          >
            <HiArrowLeft className="text-base" />
            Volver
          </button>

          {/* ── Etiqueta ── */}
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase ${
              destacado ? tema.etiquetaDestacado : tema.etiqueta
            }`}
          >
            {destacado ? (
              <HiStar className="text-xs" />
            ) : (
              <HiOutlineNewspaper className="text-xs" />
            )}
            {destacado ? "Destacado" : "Noticia"}
          </span>

          {/* ── Título ── */}
          <h1
            className={`text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl ${tema.titulo}`}
          >
            {titulo}
          </h1>

          {/* ── Subtítulo ── */}
          {subtitulo && (
            <p className={`text-lg font-medium leading-relaxed ${tema.subtitulo}`}>
              {subtitulo}
            </p>
          )}

          {/* ── Contenido completo ── */}
          {contenido && (
            <p
              className={`whitespace-pre-line text-sm leading-relaxed md:text-base ${tema.contenido}`}
            >
              {contenido}
            </p>
          )}

          {/* ── Fecha ── */}
          <div
            className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${tema.fecha}`}
          >
            <HiCalendarDays className="text-base" />
            <time dateTime={fecha_creacion}>
              {formatearFecha(fecha_creacion)}
            </time>
          </div>
        </motion.div>

        {/* ═══════════ Derecha: imagen ═══════════ */}
        <motion.div
          className=" h-full w-full flex items-center justify-center overflow-hidden md:h-auto md:w-[55%]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {imagen_url ? (
            <motion.img
              src={imagen_url}
              alt={titulo}
              className="flex inset-0 h-[30vw] w-full object-cover"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          ) : (
            <div className={`absolute inset-0 ${tema.placeholder}`} />
          )}
        </motion.div>
      </motion.div>
    </main>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Export — Suspense para useSearchParams
   ═══════════════════════════════════════════════════════════════ */
export default function NoticiaIdPage() {
  return (
    <Suspense fallback={null}>
      <NoticiaDetalleContent />
    </Suspense>
  );
}