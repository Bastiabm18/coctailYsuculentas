"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FaFire, FaStar, FaSyncAlt, FaGlassMartiniAlt } from "react-icons/fa";
import { GiCookingPot, GiWineGlass } from "react-icons/gi";
import { IoWater } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import { HiArrowLeft } from "react-icons/hi2";
import { useCart } from "@/context/CartContext";
import type { Producto } from "@/app/types/productos";

/* Campos extra opcionales para el reverso. Si no existen en tu tabla, el reverso muestra textos por defecto. */
export type ProductoDetalle = Producto & {
  ingredientes?: string[] | string | null;
  volumen_ml?: number | null;
  graduacion?: number | null; // % de alcohol
  alergenos?: string[] | string | null;
  preparacion?: string | null;
};

const lista = (v?: string[] | string | null): string[] =>
  Array.isArray(v)
    ? v
    : v
      ? v.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

/* Todos los tamaños en cqw (1cqw = 1% del ancho de la carta): escala sola */
const fs = (n: number) => ({ fontSize: `${n}cqw` });
const pad = (n: number, l = 3) => String(n).padStart(l, "0");

const PLATA =
  "linear-gradient(180deg,#ffffff 0%,#dfe2e4 40%,#a9aeb3 52%,#e9ecee 80%,#cfd3d6 100%)";

/* Valores animados compartidos por ambas caras */
type Fx = {
  holoPos: MotionValue<string>;
  holoOpacity: MotionValue<number>;
  glare: MotionValue<string>;
  glareOpacity: MotionValue<number>;
};

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

/* Marco amarillo. Es hijo del contenedor (containerType) para que los cqw se midan contra la carta. */
function Marco({ children }: { children: ReactNode }) {
  return (
    <div
      className="h-full w-full shadow-[0_10px_30px_rgba(0,0,0,.35)]"
      style={{
        background: "#f2cf3e",
        padding: "2.8cqw",
        borderRadius: "5.6cqw",
      }}
    >
      {children}
    </div>
  );
}

function Brillo({ fx }: { fx: Fx }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: fx.glare,
        opacity: fx.glareOpacity,
        mixBlendMode: "soft-light",
      }}
    />
  );
}

/* ================= FRENTE ================= */
function CaraFrente({
  producto,
  index,
  total,
  onAdd,
  fx,
}: {
  producto: ProductoDetalle;
  index: number;
  total: number;
  onAdd: () => void;
  fx: Fx;
}) {
  return (
    <Marco>
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
          className="relative mt-[0.6cqw] h-[38%] shrink-0 overflow-hidden bg-[#f6c453]"
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
              opacity: fx.holoOpacity,
              mixBlendMode: "color-dodge",
              backgroundPosition: fx.holoPos,
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
          className="mt-[1.6cqw] min-h-0 flex-1 overflow-hidden leading-[1.25]"
          style={fs(3)}
        >
          <span className="font-extrabold text-[#2f2ba0]">
            Poder de la casa: <span className="font-bold">Sabor Intenso. </span>
          </span>
          <span className="line-clamp-4">
            {producto.descripcion ??
              "Preparado el mismo día. Cada trago se arma al momento."}
          </span>
        </div>

        {/* Ataque = añadir */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          whileTap={{ scale: 0.97 }}
          aria-label={`Añadir ${producto.nombre} al carrito`}
          className="mt-[0.6cqw] flex w-full items-center gap-[1.5cqw] border-y border-black/30 bg-white/20 px-[0.6cqw] py-[0.8cqw] text-left transition-colors hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2f2ba0]"
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

        {/* Debilidad / resistencia / retirada */}
        <div
          className="mt-[1cqw] grid grid-cols-3 gap-[1cqw] border-b border-black/20 pb-[1cqw] text-center font-semibold leading-tight"
          style={fs(2.3)}
        >
          <div className="flex flex-col items-center gap-[0.6cqw]">
            <span>debilidad</span>
            <span className="flex items-center gap-[0.6cqw] font-bold" style={fs(2.8)}>
              <Energia className="bg-[#2f8fe0] text-white">
                <IoWater />
              </Energia>
              ×2
            </span>
          </div>
          <div className="flex flex-col items-center gap-[0.6cqw]">
            <span>resistencia</span>
            <span className="flex items-center gap-[0.6cqw] font-bold" style={fs(2.8)}>
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
          <span>Toca la carta para girarla</span>
        </div>

        <Brillo fx={fx} />
      </div>
    </Marco>
  );
}

/* ================= REVERSO ================= */
function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="min-h-0">
      <div
        className="flex h-[4.6cqw] w-[58%] items-center px-[2.4cqw] font-extrabold italic uppercase text-[#1a1a1a]"
        style={{
          ...fs(2.5),
          background: PLATA,
          clipPath: "polygon(0 0,100% 0,95% 100%,0 100%)",
        }}
      >
        {titulo}
      </div>
      <div className="mt-[1.6cqw]">{children}</div>
    </div>
  );
}

function CaraReverso({
  producto,
  index,
  total,
  fx,
}: {
  producto: ProductoDetalle;
  index: number;
  total: number;
  fx: Fx;
}) {
  const ingredientes = lista(producto.ingredientes);
  const alergenos = lista(producto.alergenos);
  const precio = `$${producto.precio.toLocaleString("es-CL")}`;

  const filas: [string, string][] = [
    ["Tipo", producto.tipo ?? "Cóctel"],
    ["Precio", precio],
  ];
  if (producto.volumen_ml) filas.push(["Volumen", `${producto.volumen_ml} ml`]);
  if (producto.graduacion != null)
    filas.push(["Graduación", `${producto.graduacion}% vol.`]);
  if (alergenos.length) filas.push(["Alérgenos", alergenos.join(", ")]);

  return (
    <Marco>
      <div
        className="relative flex h-full w-full flex-col overflow-hidden px-[4.5cqw] py-[4cqw]"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #b23a26 0%, #7a2418 55%, #3f130c 100%)",
          borderRadius: "3cqw",
          color: "#fbe9dc",
        }}
      >
        {/* Emblema de fondo */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{
            width: "96cqw",
            height: "96cqw",
            border: "2.4cqw solid rgba(255,255,255,.06)",
            boxShadow: "inset 0 0 0 6cqw rgba(255,255,255,.04)",
            color: "rgba(255,255,255,.07)",
            fontSize: "52cqw",
          }}
        >
          <FaGlassMartiniAlt />
        </div>

        {/* Encabezado */}
        <div className="relative z-10 text-center">
          <p
            className="font-bold uppercase tracking-[0.3em] text-[#f2cf3e]"
            style={fs(2.3)}
          >
            Ficha del cóctel
          </p>
          <h3
            className="mt-[0.8cqw] truncate font-extrabold leading-none"
            style={fs(7)}
          >
            {producto.nombre}
          </h3>
          <div className="mx-auto mt-[2cqw] h-[0.5cqw] w-[30cqw] rounded-full bg-[#f2cf3e]" />
        </div>

        {/* Secciones */}
        <div className="relative z-10 mt-[3.5cqw] flex min-h-0 flex-1 flex-col gap-[3cqw] overflow-hidden">
          <Seccion titulo="Ingredientes">
            {ingredientes.length ? (
              <ul className="flex flex-wrap gap-[1.2cqw]">
                {ingredientes.map((ing) => (
                  <li
                    key={ing}
                    className="rounded-full bg-[#f2cf3e] px-[2.2cqw] py-[0.7cqw] font-semibold text-[#3a1208]"
                    style={fs(2.7)}
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic opacity-80" style={fs(2.9)}>
                Receta de la casa. Pregúntanos por los ingredientes.
              </p>
            )}
          </Seccion>

          <Seccion titulo="Detalles">
            <dl
              className="grid grid-cols-[auto_1fr] gap-x-[4cqw] gap-y-[1cqw]"
              style={fs(2.9)}
            >
              {filas.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-semibold opacity-70">{k}</dt>
                  <dd className="text-right font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </Seccion>

          <Seccion titulo="Preparación">
            <p className="line-clamp-4 leading-[1.3]" style={fs(2.9)}>
              {producto.preparacion ??
                "Preparado al momento, el mismo día, con ingredientes de mercado."}
            </p>
          </Seccion>
        </div>

        {/* Pie */}
        <div
          className="relative z-10 mt-[2cqw] flex items-center justify-between font-semibold opacity-80"
          style={fs(2.2)}
        >
          <span>Cocteleria · Penco</span>
          <span className="font-bold" style={fs(2.5)}>
            {pad(index + 1)}/{pad(total)} ★
          </span>
        </div>

        <Brillo fx={fx} />
      </div>
    </Marco>
  );
}

/* ================= PÁGINA ================= */
export default function DetalleCoctel({
  producto,
  index,
  total,
}: {
  producto: ProductoDetalle;
  index: number;
  total: number;
}) {
  const { agregarItem } = useCart();
  const [volteada, setVolteada] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 160, damping: 20 });
  const sy = useSpring(my, { stiffness: 160, damping: 20 });
  const sh = useSpring(hover, { stiffness: 120, damping: 20 });

  const rotateY = useTransform(sx, [0, 1], [-12, 12]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);

  const px = useTransform(sx, [0, 1], [0, 100]);
  const py = useTransform(sy, [0, 1], [0, 100]);

  const fx: Fx = {
    holoPos: useMotionTemplate`${px}% ${py}%`,
    holoOpacity: useTransform(sh, [0, 1], [0.4, 0.95]),
    glare: useMotionTemplate`radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,.55), rgba(255,255,255,0) 55%)`,
    glareOpacity: useTransform(sh, [0, 1], [0, 0.8]),
  };

  // El rect se mide en el contenedor estático (no en el que rota) para evitar saltos
  function onMove(e: React.PointerEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  const onEnter = () => hover.set(1);
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    hover.set(0);
  };

  const agregar = () =>
    agregarItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      tienda: "cocteleria",
    });

  const cara = {
    position: "absolute" as const,
    inset: 0,
    containerType: "inline-size" as const,
    backfaceVisibility: "hidden" as const,
    WebkitBackfaceVisibility: "hidden" as const,
  };

  return (
    // pt-28 / md:pt-32 = alto del menú flotante
    <section className="min-h-screen bg-pastel-peach px-6 pb-24 pt-28 md:pt-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <div className="w-full">
          <Link
            href="/cocteleria#productos"
            className="inline-flex items-center gap-2 text-sm font-medium text-pastel-brown/70 transition-colors hover:text-pastel-brown"
          >
            <HiArrowLeft />
            Volver al menú
          </Link>
        </div>

        <h1 className="sr-only">{producto.nombre}</h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-[380px]"
          style={{ perspective: 1000 }}
          ref={ref}
          onPointerMove={onMove}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
        >
          {/* Inclinación con el mouse */}
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onClick={() => setVolteada((v) => !v)}
            className="cursor-pointer"
          >
            {/* Giro de la carta */}
            <motion.div
              animate={{ rotateY: volteada ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative aspect-[63/88] w-full"
            >
              <div
                style={{ ...cara, pointerEvents: volteada ? "none" : "auto" }}
              >
                <CaraFrente
                  producto={producto}
                  index={index}
                  total={total}
                  onAdd={agregar}
                  fx={fx}
                />
              </div>

              <div
                style={{
                  ...cara,
                  transform: "rotateY(180deg)",
                  pointerEvents: volteada ? "auto" : "none",
                }}
              >
                <CaraReverso
                  producto={producto}
                  index={index}
                  total={total}
                  fx={fx}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setVolteada((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-pastel-brown/30 px-6 py-3 text-xs font-medium tracking-wider uppercase text-pastel-brown transition-all hover:bg-pastel-brown hover:text-white"
          >
            <FaSyncAlt />
            {volteada ? "Ver frente" : "Ver reverso"}
          </button>
          <button
            type="button"
            onClick={agregar}
            className="flex items-center gap-2 rounded-full bg-pastel-red px-6 py-3 text-xs font-medium tracking-wider uppercase text-white transition-all hover:bg-pastel-red-hover"
          >
            Añadir al carrito
            <MdAddShoppingCart />
          </button>
        </div>
      </div>
    </section>
  );
}