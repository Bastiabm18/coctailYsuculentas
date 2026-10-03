"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { GiCactus, GiEyeTarget, GiPlantSeed } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { IoWater } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import type { Producto } from "@/app/types/productos";
import { useTilt } from "../../hook/usetilt";

/* Grosor del marco amarillo (en cqw = % del ancho de la carta): arriba / lados / abajo */
const MARCO_PAD = "4.5cqw 4.5cqw 6.5cqw";

const TEMA = {
  marco: "linear-gradient(135deg,#f6ec52 0%,#e9da2e 55%,#d9d02a 100%)",
  cuerpo:
    "radial-gradient(circle at 50% 64%, rgba(255,255,255,.45), transparent 60%), radial-gradient(circle at 8% 14%, rgba(255,255,160,.55), transparent 45%), linear-gradient(180deg,#b9de72 0%,#92cc5c 38%,#7cc24f 66%,#a9d974 100%)",
  pasto: "radial-gradient(circle at 35% 30%, #86e56c, #1c9a3a 72%)",
  pastoIcono: "#e2ffd8",
  pastoBorde: "#173a10",
  incolora: "radial-gradient(circle at 35% 30%, #ffffff, #cdd0d1 72%)",
  habilidadNombre: "#8a1717",
  habilidadPildora: "#c4161c",
  texto: "#16240f",
  titulo: "#0f1a0a",
};

const PLATA =
  "linear-gradient(180deg,#ffffff 0%,#dfe2e4 40%,#a9aeb3 52%,#e9ecee 80%,#cfd3d6 100%)";

const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    // tope en el retraso para que un grid grande no tarde en aparecer
    transition: { delay: Math.min(i, 6) * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const fs = (n: number) => ({ fontSize: `${n}cqw` });
const pad = (n: number, l = 3) => String(n).padStart(l, "0");

function Energia({
  tipo,
  size = 6,
  ojo = false,
}: {
  tipo: "pasto" | "incolora";
  size?: number;
  ojo?: boolean; // true = íconos de "ver" en vez de cactus/estrella
}) {
  const pasto = tipo === "pasto";
  const Icono = ojo ? (pasto ? GiEyeTarget : FaEye) : pasto ? GiCactus : FaStar;
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: `${size}cqw`,
        height: `${size}cqw`,
        background: pasto ? TEMA.pasto : TEMA.incolora,
        border: `0.35cqw solid ${pasto ? TEMA.pastoBorde : "#3b3f41"}`,
        boxShadow: "0 0.2cqw 0.4cqw rgba(0,0,0,.3)",
        color: pasto ? TEMA.pastoIcono : "#2f3335",
        fontSize: `${size * 0.55}cqw`,
      }}
    >
      <Icono />
    </span>
  );
}

export type CartaProps = {
  producto: Producto;
  index: number; // número de carta (posición en el catálogo)
  total: number;
  orden?: number; // orden de aparición en pantalla (para la animación)
  onAdd: () => void;
};

export default function CartaSuculenta({
  producto,
  index,
  total,
  orden = 0,
  onAdd,
}: CartaProps) {
  const router = useRouter();
  const t = useTilt(14);

  const precio = `$${producto.precio.toLocaleString("es-CL")}`;
  const tipo = producto.tipo ?? "Suculenta";

  return (
    <motion.article
      custom={orden}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mx-auto w-full max-w-[340px]"
      style={{ perspective: 900 }}
      ref={t.ref}
      {...t.handlers}
    >
      <motion.div style={{ rotateX: t.rotateX, rotateY: t.rotateY }}>
        {/* Contenedor de medidas: todo lo de adentro usa cqw relativo a esta carta */}
        <div
          className="relative aspect-[63/88] w-full"
          style={{ containerType: "inline-size" }}
        >
          {/* Marco amarillo-lima */}
          <div
            className="relative h-full w-full shadow-[0_12px_32px_rgba(0,0,0,.45)]"
            style={{
              background: TEMA.marco,
              padding: MARCO_PAD,
              borderRadius: "4cqw",
              color: TEMA.texto,
            }}
          >
            {/* Cuerpo verde */}
            <div
              className="relative flex h-full w-full flex-col overflow-hidden px-[4.5cqw]"
              style={{ background: TEMA.cuerpo, borderRadius: "1.2cqw" }}
            >
              {/* Encabezado: nombre · precio · tipo */}
              <div className="flex h-[11cqw] shrink-0 items-center gap-[1.5cqw] pt-[1cqw]">
                <h3
                  className="min-w-0 flex-1 truncate font-extrabold leading-none tracking-tight"
                  style={{ ...fs(6.4), color: TEMA.titulo }}
                >
                  {producto.nombre}
                </h3>

                <div className="flex shrink-0 items-baseline gap-[0.8cqw]">
                  <span className="font-bold" style={fs(2.4)}>
                    PRECIO
                  </span>
                  <span className="font-extrabold leading-none" style={fs(5.2)}>
                    {precio}
                  </span>
                </div>

                <span
                  className="flex shrink-0 items-center justify-center rounded-full"
                  style={{
                    width: "8.5cqw",
                    height: "8.5cqw",
                    background: TEMA.pasto,
                    border: "0.6cqw solid #fff",
                    boxShadow:
                      "0 0 0 0.35cqw #1c8a34, 0 0.4cqw 0.8cqw rgba(0,0,0,.4)",
                    color: "#fff",
                    fontSize: "4.6cqw",
                  }}
                >
                  <GiCactus />
                </span>
              </div>

              {/* Imagen + holo */}
              <div
                className="relative mt-[0.5cqw] h-[46cqw] shrink-0 overflow-hidden bg-[#fbd9a0]"
                style={{
                  border: "0.5cqw solid #9ea4a8",
                  boxShadow:
                    "0 0 1.2cqw rgba(0,0,0,.4) inset, 0.4cqw 0.4cqw 0.9cqw rgba(0,0,0,.3)",
                }}
              >
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,#eaf7b8,#7fc25a)]">
                    <GiCactus className="text-black/20" style={fs(26)} />
                  </div>
                )}

                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: t.holoOpacity,
                    mixBlendMode: "color-dodge",
                    backgroundPosition: t.holoPos,
                    backgroundSize: "260% 260%, 14px 14px",
                    backgroundImage:
                      "repeating-linear-gradient(115deg, rgba(255,0,150,.5) 0%, rgba(255,210,0,.5) 14%, rgba(0,255,160,.5) 28%, rgba(0,200,255,.5) 42%, rgba(150,0,255,.5) 56%, rgba(255,0,150,.5) 70%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.9) 0 1px, transparent 1.5px)",
                  }}
                />
              </div>

              {/* Fila evolución: miniatura · stage · ilus */}
              <div className="relative flex h-[8cqw] shrink-0 items-center gap-[1.6cqw] pl-[10.5cqw]">
                <div
                  className="absolute left-[-2cqw] top-[-4.5cqw] z-10 flex items-center justify-center rounded-full"
                  style={{
                    width: "11cqw",
                    height: "11cqw",
                    background: PLATA,
                    border: "0.6cqw solid #b2b7ba",
                    boxShadow: "0 0.4cqw 0.8cqw rgba(0,0,0,.4)",
                    color: "#3f7a3a",
                    fontSize: "6.4cqw",
                  }}
                >
                  <GiPlantSeed />
                </div>

                <span
                  className="flex h-[3.8cqw] max-w-[24cqw] shrink-0 items-center rounded-[0.8cqw] px-[1.6cqw] font-extrabold italic uppercase leading-none"
                  style={{
                    ...fs(2.4),
                    background: "linear-gradient(180deg,#eef0f1,#b9bdbf)",
                    border: "0.25cqw solid #6d7275",
                  }}
                >
                  <span className="truncate">{tipo}</span>
                </span>
                <span className="min-w-0 flex-1 truncate italic" style={fs(2.3)}>
                  Crece desde una semilla
                </span>
                <span className="shrink-0 italic" style={fs(2.1)}>
                  Ilus. Vivero local
                </span>
              </div>

              {/* Planta-BODY (descripción) + ataques */}
              <div className="mt-[1.6cqw] flex min-h-0 flex-1 flex-col">
                <div className="flex items-center gap-[2cqw]">
                  <span
                    className="flex h-[5cqw] shrink-0 items-center rounded-[1.4cqw] px-[2.4cqw] font-extrabold italic leading-none"
                    style={{
                      ...fs(3.1),
                      color: TEMA.habilidadPildora,
                      background: "linear-gradient(180deg,#ffffff,#dde6d2)",
                      border: `0.35cqw solid ${TEMA.habilidadPildora}`,
                    }}
                  >
                    Planta-BODY
                  </span>
                  <span
                    className="truncate font-extrabold leading-none"
                    style={{ ...fs(4.6), color: TEMA.habilidadNombre }}
                  >
                    Poca agua
                  </span>
                </div>
                <p
                  className="mt-[1.2cqw] line-clamp-2 leading-[1.22]"
                  style={fs(3.3)}
                >
                  {producto.descripcion ??
                    "Una vez por semana basta con un poco de agua. Déjala al sol y se encarga del resto."}
                </p>

                {/* Ataque: añadir */}
                <motion.button
                  type="button"
                  onClick={onAdd}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Añadir ${producto.nombre} al carrito`}
                  className="group mt-[1.8cqw] w-full rounded-[1cqw] px-[0.5cqw] py-[0.8cqw] text-left transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16240f]"
                >
                  <span className="flex items-center">
                    <span className="flex w-[19cqw] shrink-0 gap-[0.7cqw]">
                      <Energia tipo="pasto" />
                      <Energia tipo="pasto" />
                      <Energia tipo="incolora" />
                    </span>
                    <span
                      className="flex-1 font-extrabold leading-none"
                      style={{ ...fs(4.6), color: TEMA.titulo }}
                    >
                      Añadir
                    </span>
                    <span
                      className="flex items-center gap-[1cqw] font-extrabold leading-none"
                      style={{ ...fs(5.2), color: TEMA.titulo }}
                    >
                      +1
                      <MdAddShoppingCart className="transition-transform group-hover:scale-125" />
                    </span>
                  </span>
                  <span className="mt-[1cqw] block leading-[1.22]" style={fs(3.3)}>
                    Esta acción suma 1 unidad al carrito por {precio}.
                  </span>
                </motion.button>

                {/* Ataque: ver detalles */}
                <motion.button
                  type="button"
                  onClick={() =>
                    router.push(`/suculentas/productos/${producto.id}`)
                  }
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Ver detalles de ${producto.nombre}`}
                  className="group mt-[1.2cqw] w-full rounded-[1cqw] px-[0.5cqw] py-[0.8cqw] text-left transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16240f]"
                >
                  <span className="flex items-center">
                    <span className="flex w-[19cqw] shrink-0 gap-[0.7cqw]">
                      <Energia tipo="pasto" ojo />
                      <Energia tipo="pasto" ojo />
                      <Energia tipo="incolora" ojo />
                    </span>
                    <span
                      className="flex-1 font-extrabold leading-none"
                      style={{ ...fs(4.6), color: TEMA.titulo }}
                    >
                      Ver detalles
                    </span>
                  </span>
                </motion.button>
              </div>

              {/* Debilidad / resistencia / retirada */}
              <div className="mt-auto grid shrink-0 grid-cols-3 border-t border-black/25 pt-[1cqw] text-center">
                <div className="flex flex-col items-center gap-[0.6cqw]">
                  <span className="font-semibold" style={fs(2.1)}>
                    debilidad
                  </span>
                  <span className="flex h-[4.4cqw] items-center gap-[0.8cqw]">
                    <span
                      className="flex items-center justify-center rounded-full text-white"
                      style={{
                        width: "4.2cqw",
                        height: "4.2cqw",
                        background:
                          "radial-gradient(circle at 35% 30%,#6cc3ff,#1f78d1 70%)",
                        border: "0.3cqw solid #0e3d6b",
                        fontSize: "2.6cqw",
                      }}
                    >
                      <IoWater />
                    </span>
                    <span className="font-extrabold" style={fs(3.2)}>
                      ×2
                    </span>
                  </span>
                </div>
                <div className="flex flex-col items-center gap-[0.6cqw]">
                  <span className="font-semibold" style={fs(2.1)}>
                    resistencia
                  </span>
                  <span className="h-[4.4cqw]" />
                </div>
                <div className="flex flex-col items-center gap-[0.6cqw]">
                  <span className="font-semibold" style={fs(2.1)}>
                    coste de retirada
                  </span>
                  <span className="flex h-[4.4cqw] items-center gap-[0.6cqw]">
                    <Energia tipo="incolora" size={4.2} />
                    <Energia tipo="incolora" size={4.2} />
                    <Energia tipo="incolora" size={4.2} />
                  </span>
                </div>
              </div>

              {/* Pie */}
              <div
                className="mt-[1cqw] mb-[1.6cqw] flex shrink-0 items-center justify-between font-semibold"
                style={fs(2.1)}
              >
                <span>Colección Suculentas</span>
                <span className="font-bold" style={fs(2.6)}>
                  {pad(index + 1)}/{pad(total)} ★
                </span>
              </div>

              {/* Brillo que sigue al cursor */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: t.glare,
                  opacity: t.glareOpacity,
                  mixBlendMode: "soft-light",
                }}
              />
            </div>

            {/* Copyright sobre el marco */}
            <span
              className="absolute inset-x-0 bottom-[1.6cqw] text-center"
              style={{ ...fs(1.8), color: TEMA.texto }}
            >
              ©{new Date().getFullYear()} Suculentas / Vivero
            </span>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}