"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaFire, FaStar, FaEye } from "react-icons/fa";
import { GiCookingPot, GiWineGlass } from "react-icons/gi";
import { IoWater } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import type { Producto } from "@/app/types/productos";
import { useTilt } from "../../hook/usetilt";

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
  children,
  className = "",
  size = 5.6,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-black/70 shadow-[inset_0_-2px_3px_rgba(0,0,0,.25)] ${className}`}
      style={{
        width: `${size}cqw`,
        height: `${size}cqw`,
        fontSize: `${size * 0.55}cqw`,
      }}
    >
      {children}
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

export default function CartaCocteleria({
  producto,
  index,
  total,
  orden = 0,
  onAdd,
}: CartaProps) {
  const router = useRouter();
  const t = useTilt(14);

  return (
    <motion.article
      custom={orden}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mx-auto w-full max-w-[320px]"
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
          {/* Marco amarillo */}
          <div
            className="h-full w-full shadow-[0_10px_30px_rgba(0,0,0,.35)]"
            style={{
              background: "#f2cf3e",
              padding: "2.8cqw",
              borderRadius: "5.6cqw",
            }}
          >
            {/* Cuerpo */}
            <div
              className="relative flex h-full w-full flex-col overflow-hidden px-[3.1cqw] pt-[1.9cqw] pb-[1.9cqw]"
              style={{
                background:
                  "linear-gradient(165deg,#f8a45e 0%,#f0773f 45%,#ea5a3b 100%)",
                borderRadius: "3cqw",
                color: "#1a1a1a",
              }}
            >
              {/* Encabezado */}
              <div className="flex items-start gap-[2.5cqw]">
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-[1.6cqw]">
                    <span
                      className="flex items-center gap-[0.8cqw] rounded-sm border border-black/50 bg-gradient-to-b from-[#fff3b0] to-[#e8b93c] px-[1.6cqw] py-[0.3cqw] font-extrabold uppercase italic leading-tight"
                      style={fs(2.5)}
                    >
                      <GiCookingPot style={fs(3.1)} />
                      {producto.tipo ?? "Cóctel"}
                    </span>
                    <span
                      className="truncate font-semibold italic leading-tight"
                      style={fs(2.5)}
                    >
                      Preparado hoy con ingredientes de mercado
                    </span>
                  </div>
                  <h3
                    className="mt-[0.6cqw] truncate font-extrabold leading-none tracking-tight"
                    style={fs(6.9)}
                  >
                    {producto.nombre}
                  </h3>
                </div>

                <div className="flex shrink-0 items-center gap-[1cqw] pt-[3cqw]">
                  <span className="font-extrabold leading-none" style={fs(5.3)}>
                    ${producto.precio.toLocaleString("es-CL")}
                  </span>
                  <FaFire className="text-[#e5361f]" style={fs(5)} />
                </div>
              </div>

              {/* Imagen + foil */}
              <div
                className="relative mt-[0.6cqw] h-[34%] shrink-0 overflow-hidden bg-[#f6c453]"
                style={{
                  border: "0.9cqw solid #d8b23a",
                  boxShadow: "1.2cqw 1.2cqw 0 rgba(0,0,0,.35)",
                }}
              >
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,#ffe58a,#f09a3e)]">
                    <GiCookingPot className="text-black/25" style={fs(19)} />
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
                      "repeating-linear-gradient(115deg, rgba(255,0,150,.55) 0%, rgba(255,210,0,.55) 14%, rgba(0,255,160,.55) 28%, rgba(0,200,255,.55) 42%, rgba(150,0,255,.55) 56%, rgba(255,0,150,.55) 70%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.9) 0 1px, transparent 1.5px)",
                  }}
                />
              </div>

              {/* Franja */}
              <div
                className="mx-auto mt-[1.6cqw] w-[92%] border border-[#b8902a] bg-gradient-to-b from-[#f9e07a] to-[#e7bd45] py-[0.3cqw] text-center font-bold italic leading-tight"
                style={fs(2.5)}
              >
                Cóctel de la casa. Servido bien frío.
              </div>

              {/* Poder (descripción) */}
              <div
                className="mt-[1.4cqw] min-h-0 flex-1 overflow-hidden leading-[1.25]"
                style={fs(3)}
              >
                <span className="font-extrabold text-[#2f2ba0]">
                  Poder de la casa:{" "}
                  <span className="font-bold">Sabor Intenso. </span>
                </span>
                <span className="line-clamp-3">
                  {producto.descripcion ??
                    "Preparado el mismo día. Cada trago se arma al momento."}
                </span>
              </div>

              {/* Ataque: añadir */}
              <motion.button
                type="button"
                onClick={onAdd}
                whileTap={{ scale: 0.97 }}
                aria-label={`Añadir ${producto.nombre} al carrito`}
                className="mt-[0.6cqw] flex w-full items-center gap-[1.5cqw] border-y border-black/30 bg-white/20 px-[0.6cqw] py-[0.7cqw] text-left transition-colors hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2f2ba0]"
              >
                <span className="flex gap-[0.6cqw]">
                  <Energia className="bg-[#e5361f] text-white">
                    <FaFire />
                  </Energia>
                  <Energia className="bg-[#e5361f] text-white">
                    <FaFire />
                  </Energia>
                </span>
                <span className="flex-1 font-extrabold leading-none" style={fs(4.7)}>
                  Añadir
                  <span className="ml-[1cqw] font-semibold italic" style={fs(2.5)}>
                    al carrito
                  </span>
                </span>
                <span
                  className="flex items-center gap-[1cqw] font-extrabold leading-none"
                  style={fs(6.9)}
                >
                  +1
                  <MdAddShoppingCart style={fs(5)} />
                </span>
              </motion.button>

              {/* Ataque: ver más */}
              <motion.button
                type="button"
                onClick={() => router.push(`/cocteleria/productos/${producto.id}`)}
                whileTap={{ scale: 0.97 }}
                aria-label={`Ver detalles de ${producto.nombre}`}
                className="mt-[0.6cqw] flex w-full items-center gap-[1.5cqw] border-y border-black/30 bg-white/20 px-[0.6cqw] py-[0.7cqw] text-left transition-colors hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2f2ba0]"
              >
                <span className="flex gap-[0.6cqw]">
                  <Energia className="bg-[#e5361f] text-white">
                    <FaEye />
                  </Energia>
                  <Energia className="bg-[#e5361f] text-white">
                    <FaEye />
                  </Energia>
                </span>
                <span className="flex-1 font-extrabold leading-none" style={fs(4.7)}>
                  Ver más
                  <span className="ml-[1cqw] font-semibold italic" style={fs(2.5)}>
                    detalles
                  </span>
                </span>
              </motion.button>

              {/* Debilidad / resistencia / retirada */}
              <div
                className="mt-[1cqw] grid grid-cols-3 gap-[1cqw] border-b border-black/20 pb-[1cqw] text-center font-semibold leading-tight"
                style={fs(2.3)}
              >
                <div className="flex flex-col items-center gap-[0.6cqw]">
                  <span>debilidad</span>
                  <span
                    className="flex items-center gap-[0.6cqw] font-bold"
                    style={fs(2.8)}
                  >
                    <Energia className="bg-[#2f8fe0] text-white">
                      <IoWater />
                    </Energia>
                    ×2
                  </span>
                </div>
                <div className="flex flex-col items-center gap-[0.6cqw]">
                  <span>resistencia</span>
                  <span
                    className="flex items-center gap-[0.6cqw] font-bold"
                    style={fs(2.8)}
                  >
                    <Energia className="bg-[#9a5a2b] text-white">
                      <GiWineGlass />
                    </Energia>
                    -30
                  </span>
                </div>
                <div className="flex flex-col items-center gap-[0.6cqw]">
                  <span>coste de retirada</span>
                  <span className="flex gap-[0.6cqw]">
                    {[0, 1, 2].map((n) => (
                      <Energia key={n} className="bg-white text-[#777]">
                        <FaStar />
                      </Energia>
                    ))}
                  </span>
                </div>
              </div>

              {/* Texto de sabor */}
              <div
                className="mt-[1cqw] border border-[#b8902a] bg-[#f6c453]/55 px-[1.6cqw] py-[0.9cqw] italic leading-[1.2]"
                style={fs(2.3)}
              >
                Se sirve tan frío que apaga hasta el fuego más terco. Probado sin
                querer por más de un cliente.
              </div>

              {/* Pie */}
              <div
                className="mt-[1cqw] flex items-center justify-between font-semibold"
                style={fs(2.2)}
              >
                <span className="flex items-center gap-[1cqw]">
                  <span
                    className="rounded-sm border border-black/50 bg-[#f2cf3e] px-[1cqw] font-extrabold"
                    style={fs(2.2)}
                  >
                    CLC
                  </span>
                  <span className="font-bold" style={fs(2.5)}>
                    {pad(index + 1)}/{pad(total)}
                  </span>
                </span>
                <span>Ilus. Cocteleria</span>
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
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}