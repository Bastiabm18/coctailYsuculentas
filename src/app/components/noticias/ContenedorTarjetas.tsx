"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineNewspaper, HiArrowRight, HiPlus } from "react-icons/hi2";
import type { Noticia } from "@/app/types/productos";
import { obtenerNoticiasVisibles } from "@/app/actions/actions";

interface Props {
  tienda: "cocteleria" | "suculentas";
}

export default function ContenedorNoticias({ tienda }: Props) {
  const [noticia, setNoticia] = useState<Noticia | null>(null);

  const bgFondo = tienda === "cocteleria" ? "bg-pastel-peach/50" : "bg-terra-dark";
  const bgText = tienda === "cocteleria" ? "text-pastel-brown" : "text-cream";
  const badgeClase =
    tienda === "cocteleria"
      ? "bg-pastel-peach text-pastel-brown"
      : "bg-white/10 text-cream backdrop-blur-sm";

  const fondoContenido = tienda === "cocteleria" ? "bg-white" : "bg-terra-dark";
  const colorTitulo = tienda === "cocteleria" ? "text-pastel-brown" : "text-cream";
  const colorSubtitulo = tienda === "cocteleria" ? "text-pastel-brown/70" : "text-cream/70";
  const colorContenido = tienda === "cocteleria" ? "text-pastel-brown/90" : "text-cream/90";
  const colorLink = tienda === "cocteleria" ? "text-pastel-brown" : "text-cream";
  const bordeSeparador = tienda === "cocteleria" ? "border-pastel-brown/15" : "border-cream/15";

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
    <div className={`relative w-full flex flex-col gap-10 pb-16 ${bgFondo}`}>
      <motion.h2
        className={`text-center ${bgText} text-3xl font-bold tracking-tight md:text-5xl pt-10`}
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
       Lo Mas Reciente
      </motion.h2>

      <div className="w-full px-4 md:px-8">
        <motion.div
          className={`relative w-full overflow-hidden rounded-2xl md:rounded-3xl border ${bordeSeparador} ${fondoContenido}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Imagen */}
          <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden group">
            {imagen_url ? (
              <motion.img
                src={imagen_url}
                alt={titulo}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            ) : (
              <div className="h-full w-full bg-neutral-300" />
            )}

            {/* Badge */}
            <motion.div
              className={`absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${badgeClase}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <HiOutlineNewspaper className="text-base" />
              Última noticia
            </motion.div>
          </div>

          {/* Texto */}
          <div className="p-6 md:p-14 flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto">
            <motion.h3
              className={`text-2xl md:text-4xl font-bold leading-tight ${colorTitulo}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {titulo}
            </motion.h3>

            {subtitulo && (
              <motion.p
                className={`text-base md:text-xl font-medium ${colorSubtitulo}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {subtitulo}
              </motion.p>
            )}

            {contenido && (
              <motion.p
                className={`text-sm md:text-base leading-relaxed whitespace-pre-line ${colorContenido}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {contenido}
              </motion.p>
            )}

            <motion.div
              className={`flex items-center gap-2 text-sm md:text-base font-medium mt-2 group cursor-pointer w-fit ${colorLink}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Leer más
              <HiArrowRight className="transition-transform group-hover:translate-x-1" />
            </motion.div>
          </div>

          {/* Separador + Ver más noticias */}
          <div className={`border-t ${bordeSeparador} px-6 md:px-14 py-4 flex justify-end`}>
            <motion.a
              href="/noticias"
              className={`flex items-center gap-1.5 text-xs md:text-sm font-medium opacity-60 hover:opacity-100 transition-opacity ${colorLink}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <HiPlus className="text-xs" />
              Ver más noticias
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}