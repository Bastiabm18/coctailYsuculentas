"use client";

import { motion } from "framer-motion";

interface Props {
  titulo: string;
  subtitulo: string | null;
  imagen_url: string | null;
  tienda: "cocteleria" | "suculentas";
}

export default function TarjetaNoticia({ titulo, subtitulo, imagen_url, tienda }: Props) {
  const fondoTexto = tienda === "cocteleria" ? "bg-pastel-peach" : "bg-terra-dark/50";
  const colorTexto = tienda === "cocteleria" ? "text-pastel-brown" : "text-terra-dark";

  return (
    <motion.div
      className="flex-shrink-0 w-[85vw] md:w-[44vw] h-[60vh] rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer group"
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen */}
      <div className="relative h-[65%] w-full overflow-hidden">
        {imagen_url ? (
          <img
            src={imagen_url}
            alt={titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Texto */}
      <div className={`h-[35%] p-5 flex flex-col justify-center ${fondoTexto}`}>
        <h3 className={`text-base font-bold line-clamp-2 leading-tight ${colorTexto}`}>
          {titulo}
        </h3>
        {subtitulo && (
          <p className={`text-sm mt-1.5 line-clamp-2 ${colorTexto}/70`}>
            {subtitulo}
          </p>
        )}
      </div>
    </motion.div>
  );
}