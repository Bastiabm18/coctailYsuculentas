"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineNewspaper,
  HiMagnifyingGlass,
  HiXMark,
  HiCalendarDays,
} from "react-icons/hi2";
import type { Noticia } from "@/app/types/productos";
import { obtenerTodasNoticiasVisibles } from "@/app/actions/actions";
import TarjetaNoticia from "../components/noticias/TarjetaNoticia";
import Navbar from "../components/compartidos/navbar";


/* ─── Colores por tienda ─── */
const TEMAS = {
  cocteleria: {
    fondo: "bg-pastel-peach",
    titulo: "text-pastel-brown",
    subtitulo: "text-pastel-brown/80",
    contenido: "text-pastel-brown/90",
    etiqueta: "bg-pastel-pink/30 text-pastel-brown",
    boton: "bg-pastel-red text-white hover:bg-pastel-red-hover",
    placeholder: "bg-pastel-pink/30",
    input:
      "bg-white/70 text-pastel-brown placeholder:text-pastel-brown/40 border-pastel-pink/25 focus:border-pastel-pink focus:ring-pastel-pink/20",
    fecha: "text-pastel-brown/50",
    vacio: "text-pastel-brown/40",
    separador: "border-pastel-pink/15",
    contador: "text-pastel-brown/60",
  },
  suculentas: {
    fondo: "bg-terra-dark",
    titulo: "text-cream",
    subtitulo: "text-cream/80",
    contenido: "text-cream/90",
    etiqueta: "bg-cream/15 text-cream",
    boton: "bg-cream text-terra hover:bg-cream/90",
    placeholder: "bg-terra-hover",
    input:
      "bg-terra-hover/40 text-cream placeholder:text-cream/40 border-cream/10 focus:border-cream/25 focus:ring-cream/10",
    fecha: "text-cream/45",
    vacio: "text-cream/35",
    separador: "border-cream/8",
    contador: "text-cream/55",
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
   Skeleton de carga
   ═══════════════════════════════════════════════════════════════ */
function Skeleton({ tienda }: { tienda: "cocteleria" | "suculentas" }) {
  const tema = TEMAS[tienda];
  return (
    <main className={`flex min-h-screen w-full flex-col ${tema.fondo}`}>
      {/* Hero skeleton */}
      <div className="flex h-[60vh] w-full items-center justify-center px-6 md:px-10">
        <div className={`h-8 w-48 animate-pulse rounded-lg ${tema.placeholder}`} />
      </div>
      {/* Search skeleton */}
      <div className="flex justify-center px-6 py-8">
        <div className={`h-12 w-full max-w-xl animate-pulse rounded-full ${tema.placeholder}`} />
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 md:px-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`aspect-[4/3] animate-pulse rounded-2xl ${tema.placeholder}`} />
        ))}
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Contenido principal (usa useSearchParams → necesita Suspense)
   ═══════════════════════════════════════════════════════════════ */
function NoticiasContent() {
  const searchParams = useSearchParams();
  const tienda = (
    searchParams.get("tienda") === "suculentas" ? "suculentas" : "cocteleria"
  ) as "cocteleria" | "suculentas";
  const tema = TEMAS[tienda];
  const router = useRouter();

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerTodasNoticiasVisibles()
      .then((data) => {
        setNoticias(data);
        setCargando(false);
      })
      .catch(() => {
        setNoticias([]);
        setCargando(false);
      });
  }, []);

  /* ─── Lógica de filtrado ─── */
  const noticiaPrincipal = noticias[0] ?? null;
  const buscando = busqueda.trim().length > 0;

  const noticiasGrid = useMemo(() => {
    if (!buscando) return noticias.slice(1);
    const termino = busqueda.toLowerCase().trim();
    return noticias.filter(
      (n) =>
        n.titulo.toLowerCase().includes(termino) ||
        (n.subtitulo?.toLowerCase().includes(termino) ?? false) ||
        (n.contenido?.toLowerCase().includes(termino) ?? false)
    );
  }, [noticias, busqueda, buscando]);

  /* ─── Carga ─── */
  if (cargando) return <Skeleton tienda={tienda} />;

  /* ═══════════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════════ */
  return (
    <>
    <Navbar tema="cocteleria" />
    <main className={`flex min-h-screen pt-20 w-full flex-col ${tema.fondo}`}>
      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 1 — Noticia destacada (h-[60vh])
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!buscando && noticiaPrincipal && (
          <motion.section
            key="destacada"
             onClick={() => { router.push(`/noticia_id/${noticiaPrincipal.id}`) }}
            className="relative flex h-[60vh] w-full flex-col items-center justify-evenly gap-8 overflow-hidden px-6 py-8 md:flex-row md:items-stretch md:gap-0 md:px-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* ── Textos ── */}
            <motion.div
              className="flex w-full flex-col justify-center gap-4 md:w-[42%] md:gap-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase ${tema.etiqueta}`}
              >
                <HiOutlineNewspaper className="text-sm" />
                Última noticia
              </span>

              <h1
                className={`text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem] ${tema.titulo}`}
              >
                {noticiaPrincipal.titulo}
              </h1>

              {noticiaPrincipal.subtitulo && (
                <p className={`text-base font-medium md:text-lg ${tema.subtitulo}`}>
                  {noticiaPrincipal.subtitulo}
                </p>
              )}

              <div
                className={`flex items-center gap-1.5 text-sm font-medium ${tema.fecha}`}
              >
                <HiCalendarDays className="text-base" />
                <time dateTime={noticiaPrincipal.fecha_creacion}>
                  {formatearFecha(noticiaPrincipal.fecha_creacion)}
                </time>
              </div>
            </motion.div>

            {/* ── Imagen ── */}
            <motion.div
              className="relative h-[22vh] w-full overflow-hidden rounded-2xl md:h-auto md:w-[48%] md:rounded-l-none md:rounded-r-2xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {noticiaPrincipal.imagen_url ? (
                <motion.img
                  src={noticiaPrincipal.imagen_url}
                  alt={noticiaPrincipal.titulo}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ scale: 1.08 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              ) : (
                <div
                  className={`absolute inset-0 rounded-2xl ${tema.placeholder}`}
                />
              )}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 2 — Buscador
          ═══════════════════════════════════════════════════════ */}
      <section className="flex w-full flex-col items-center gap-3 px-6 py-8 md:px-10">
        <motion.div
          className="relative w-full max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <HiMagnifyingGlass
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg ${tema.subtitulo}`}
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar noticias..."
            className={`w-full rounded-full border py-3 pl-11 pr-10 text-sm font-medium outline-none transition-all duration-200 focus:ring-2 ${tema.input}`}
          />
          {buscando && (
            <motion.button
              onClick={() => setBusqueda("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-opacity ${tema.subtitulo}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <HiXMark className="text-base" />
            </motion.button>
          )}
        </motion.div>

        {/* Contador de resultados */}
        {buscando && (
          <motion.p
            className={`text-sm font-medium ${tema.contador}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {noticiasGrid.length} resultado
            {noticiasGrid.length !== 1 ? "s" : ""} para &ldquo;
            {busqueda.trim()}&rdquo;
          </motion.p>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 3 — Grid de noticias
          ═══════════════════════════════════════════════════════ */}
      <section className="w-full px-6 pb-20 md:px-10">
        {noticiasGrid.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {noticiasGrid.map((n, i) => (
                <TarjetaNoticia
                  key={n.id}
                  noticia={n}
                  tienda={tienda}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className={`flex flex-col items-center justify-center py-24 ${tema.vacio}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HiOutlineNewspaper className="mb-5 text-6xl opacity-30" />
            <p className="text-lg font-semibold">
              {buscando
                ? "No se encontraron noticias"
                : "No hay noticias disponibles"}
            </p>
            {buscando && (
              <button
                onClick={() => setBusqueda("")}
                className={`mt-4 rounded-full px-5 py-2 text-sm font-medium transition-colors ${tema.boton}`}
              >
                Limpiar búsqueda
              </button>
            )}
          </motion.div>
        )}
      </section>
    </main>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page export — Suspense boundary para useSearchParams
   ═══════════════════════════════════════════════════════════════ */
export default function NoticiasPage() {
  return (
    <Suspense fallback={<Skeleton tienda="cocteleria" />}>
      <NoticiasContent />
    </Suspense>
  );
}