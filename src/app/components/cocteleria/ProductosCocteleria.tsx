"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { GiCookingPot, GiWineGlass } from "react-icons/gi";
import { FaEye, FaFire, FaStar } from "react-icons/fa";
import { IoWater } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import { useCart } from "@/context/CartContext";
import type { Producto } from "@/app/types/productos";
import { obtenerCoctelesVisibles } from "@/app/actions/actions";
import { useRouter } from "next/navigation";

const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

/* Círculo de energía (como los de la carta) */
function Energia({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border border-black/70 text-[10px] shadow-[inset_0_-2px_3px_rgba(0,0,0,.25)] ${className}`}
    >
      {children}
    </span>
  );
}
function Ojo({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border border-black/70 text-[10px] shadow-[inset_0_-2px_3px_rgba(0,0,0,.25)] ${className}`}
    >
      {children}
    </span>
  );
}

type CartaProps = {
  producto: Producto;
  index: number;
  total: number;
  onAdd: () => void;
};

function CartaProducto({ producto, index, total, onAdd }: CartaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // posición del mouse (0 a 1) y estado hover
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 160, damping: 20 });
  const sy = useSpring(my, { stiffness: 160, damping: 20 });
  const sh = useSpring(hover, { stiffness: 120, damping: 20 });

  // inclinación 3D
  const rotateY = useTransform(sx, [0, 1], [-14, 14]);
  const rotateX = useTransform(sy, [0, 1], [14, -14]);

  // holográfico: el arcoíris se desplaza con el mouse
  const px = useTransform(sx, [0, 1], [0, 100]);
  const py = useTransform(sy, [0, 1], [0, 100]);
  const holoPos = useMotionTemplate`${px}% ${py}%`;
  const holoOpacity = useTransform(sh, [0, 1], [0.4, 0.95]);

  // brillo (glare) que sigue al cursor
  const glare = useMotionTemplate`radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,.55), rgba(255,255,255,0) 55%)`;
  const glareOpacity = useTransform(sh, [0, 1], [0, 0.8]);

  function onMove(e: React.PointerEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onEnter() {
    hover.set(1);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
    hover.set(0);
  }

  const numero = `${String(index + 1).padStart(3, "0")}/${String(total).padStart(3, "0")}`;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mx-auto w-full max-w-[320px]"
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-[63/88] w-full rounded-[18px] bg-[#f2cf3e] p-[9px] shadow-[0_10px_30px_rgba(0,0,0,.35)]"
      >
        {/* Cuerpo de la carta */}
        <div
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[10px] px-[10px] pt-[6px] pb-[6px] text-[#1a1a1a]"
          style={{
            background:
              "linear-gradient(165deg,#f8a45e 0%,#f0773f 45%,#ea5a3b 100%)",
          }}
        >
          {/* ===== Encabezado ===== */}
          <div className="flex items-start gap-2">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 rounded-sm border border-black/50 bg-gradient-to-b from-[#fff3b0] to-[#e8b93c] px-1.5 py-[1px] text-[8px] font-extrabold uppercase italic leading-tight">
                  <GiCookingPot className="text-[10px]" />
                  {producto.tipo ?? "Cóctel"}
                </span>
                <span className="truncate text-[8px] font-semibold italic leading-tight">
                  Preparado hoy con ingredientes de mercado
                </span>
              </div>
              <h3 className="mt-0.5 truncate text-[22px] font-extrabold leading-none tracking-tight">
                {producto.nombre}
              </h3>
            </div>

            <div className="flex shrink-0 items-center gap-1 pt-[10px]">
              <span className="text-[17px] font-extrabold leading-none">
                ${producto.precio.toLocaleString("es-CL")}
              </span>
              <FaFire className="text-[16px] text-[#e5361f] drop-shadow" />
            </div>
          </div>

          {/* ===== Imagen con marco dorado + holo ===== */}
          <div
            className="relative mt-1 h-[38%] shrink-0 overflow-hidden border-[3px] border-[#d8b23a] bg-[#f6c453]"
            style={{ boxShadow: "4px 4px 0 rgba(0,0,0,.35)" }}
          >
            {producto.imagen_url ? (
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,#ffe58a,#f09a3e)]">
                <GiCookingPot className="text-6xl text-black/25" />
              </div>
            )}

            {/* Foil arcoíris */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: holoOpacity,
                mixBlendMode: "color-dodge",
                backgroundPosition: holoPos,
                backgroundSize: "260% 260%, 14px 14px",
                backgroundImage:
                  "repeating-linear-gradient(115deg, rgba(255,0,150,.55) 0%, rgba(255,210,0,.55) 14%, rgba(0,255,160,.55) 28%, rgba(0,200,255,.55) 42%, rgba(150,0,255,.55) 56%, rgba(255,0,150,.55) 70%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.9) 0 1px, transparent 1.5px)",
              }}
            />
          </div>

          {/* ===== Franja tipo "Flame Pokémon. Length..." ===== */}
          <div className="mx-auto mt-1.5 w-[92%] border border-[#b8902a] bg-gradient-to-b from-[#f9e07a] to-[#e7bd45] py-[1px] text-center text-[8px] font-bold italic leading-tight">
            Cóctel de la casa. Servido bien frío.
          </div>

          {/* ===== Poder (descripción) ===== */}
          <div className="mt-1.5 min-h-0 flex-1 overflow-hidden text-[9.5px] leading-[1.25]">
            <span className="font-extrabold text-[#2f2ba0]">
              Poder de la casa:{" "}
            </span>
            <span className="font-bold text-[#2f2ba0]">Sabor Intenso. </span>
            <span className="line-clamp-4">
              {producto.descripcion ??
                "Preparado el mismo día. Cada trago se arma al momento."}
            </span>
          </div>

          {/* ===== Ataque = botón añadir ===== */}
          <motion.button
            type="button"
            onClick={onAdd}
            whileTap={{ scale: 0.97 }}
            className="relative mt-1 flex w-full items-center gap-1.5 border-y border-black/30 bg-white/20 px-1 py-1 text-left transition-colors hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2f2ba0]"
            aria-label={`Añadir ${producto.nombre} al carrito`}
          >
            <span className="flex gap-0.5">
              <Energia className="bg-[#e5361f] text-white">
                <FaFire />
              </Energia>
              <Energia className="bg-[#e5361f] text-white">
                <FaFire />
              </Energia>
            </span>
            <span className="flex-1 text-[15px] font-extrabold leading-none">
              Añadir
              <span className="ml-1 text-[8px] font-semibold italic">
                al carrito
              </span>
            </span>
            <span className="flex items-center gap-1 text-[22px] font-extrabold leading-none">
              +1
              <MdAddShoppingCart className="text-[16px]" />
            </span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => router.push(`/cocteleria/productos/${producto.id}`)}
            whileTap={{ scale: 0.97 }}
            className="relative mt-1 flex w-full items-center gap-1.5 border-y border-black/30 bg-white/20 px-1 py-1 text-left transition-colors hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2f2ba0]"
            aria-label={`ver ${producto.nombre} `}
          >
            <span className="flex gap-0.5">
              <Energia className="bg-[#e5361f] text-white">
                <FaEye />
              </Energia>
              <Energia className="bg-[#e5361f] text-white">
                <FaEye />
              </Energia>
            </span>
            <span className="flex-1 text-[15px] font-extrabold leading-none">
              Ver más
              <span className="ml-1 text-[8px] font-semibold italic">
                detalles

             </span>
            </span>
           
          </motion.button>

          {/* ===== Debilidad / resistencia / retirada ===== */}
          <div className="mt-1 grid grid-cols-3 gap-1 border-b border-black/20 pb-1 text-center text-[7.5px] font-semibold leading-tight">
            <div className="flex flex-col items-center gap-0.5">
              <span>debilidad</span>
              <span className="flex items-center gap-0.5 text-[9px] font-bold">
                <Energia className="bg-[#2f8fe0] text-white">
                  <IoWater />
                </Energia>
                ×2
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span>resistencia</span>
              <span className="flex items-center gap-0.5 text-[9px] font-bold">
                <Energia className="bg-[#9a5a2b] text-white">
                  <GiWineGlass />
                </Energia>
                -30
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span>coste de retirada</span>
              <span className="flex gap-0.5">
                {[0, 1, 2].map((n) => (
                  <Energia key={n} className="bg-white text-[#777]">
                    <FaStar />
                  </Energia>
                ))}
              </span>
            </div>
          </div>

          {/* ===== Texto de sabor ===== */}
          <div className="mt-1 border border-[#b8902a] bg-[#f6c453]/55 px-1.5 py-[3px] text-[7.5px] italic leading-[1.2]">
            Se sirve tan frío que apaga hasta el fuego más terco. Probado
            sin querer por más de un cliente.
          </div>

          {/* ===== Pie ===== */}
          <div className="mt-1 flex items-center justify-between text-[7px] font-semibold">
            <span className="flex items-center gap-1">
              <span className="rounded-sm border border-black/50 bg-[#f2cf3e] px-1 text-[7px] font-extrabold">
                CLC
              </span>
              <span className="text-[8px] font-bold">{numero}</span>
            </span>
            <span>Ilus. Cocteleria</span>
          </div>

          {/* ===== Brillo que sigue al cursor (toda la carta) ===== */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: glare,
              opacity: glareOpacity,
              mixBlendMode: "soft-light",
            }}
          />
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function ProductosCocteleria() {
  const { agregarItem } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    obtenerCoctelesVisibles().then(setProductos).catch(() => {});
  }, []);

  return (
    <section id="productos" className="bg-pastel-peach/60 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-pastel-brown text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Nuestro menú
        </motion.h2>

        <motion.p
          className="mt-4 text-center text-pastel-brown/45 text-sm md:text-base"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Todo preparado el mismo día, con ingredientes de mercado
        </motion.p>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, i) => (
            <CartaProducto
              key={producto.id}
              producto={producto}
              index={i}
              total={productos.length}
              onAdd={() =>
                agregarItem({
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  tienda: "cocteleria",
                })
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}