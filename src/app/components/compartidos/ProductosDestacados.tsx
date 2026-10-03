"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { GiCactus, GiPlantSeed, GiCookingPot } from "react-icons/gi";
import { FaStar, FaGlassMartiniAlt } from "react-icons/fa";
import { IoWater } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import type { IconType } from "react-icons";
import { useCart } from "@/context/CartContext";
import type { Producto } from "@/app/types/productos";
import {
  obtenerCoctelesDestacados,
  obtenerSuculentasDestacadas,
} from "@/app/actions/actions";

type Tienda = "cocteleria" | "suculentas";

/* ─── Todo lo que cambia entre tiendas (el diseño de la carta es el mismo) ─── */
const CONFIG: Record<
  Tienda,
  {
    cargar: () => Promise<Producto[]>;
    base: string;
    titulo: string;
    subtitulo: string;
    fondo: string;
    colorTitulo: string;
    colorSubtitulo: string;
    Tipo: IconType; // símbolo de energía y círculo de tipo
    Miniatura: IconType; // miniatura circular
    etapa: string; // badge si el producto no tiene `tipo`
    evoluciona: string;
    datos: string; // franja bajo la imagen
    ilus: string;
    sabor: string;
    descripcionBase: string;
  }
> = {
  cocteleria: {
    cargar: obtenerCoctelesDestacados,
    base: "/cocteleria/productos",
    titulo: "Los favoritos de la casa",
    subtitulo: "Los Cocteles que más se piden, preparados el mismo día",
    fondo: "bg-pastel-peach",
    colorTitulo: "text-pastel-brown",
    colorSubtitulo: "text-pastel-brown/60",
    Tipo: FaGlassMartiniAlt,
    Miniatura: GiCookingPot,
    etapa: "Cóctel",
    evoluciona: "Preparado hoy con ingredientes de mercado",
    datos: "Servido En tu puerta",
    ilus: "Ilus. Cocteleria",
    sabor: "Sabor Casero.",
    descripcionBase: "Preparado el mismo día. Cada Dulce se arma al momento.",
  },
  suculentas: {
    cargar: obtenerSuculentasDestacadas,
    base: "/suculentas/productos",
    titulo: "Plantas destacadas",
    subtitulo: "Nuestras favoritas, elegidas especie por especie",
    fondo: "bg-terra-dark",
    colorTitulo: "text-cream",
    colorSubtitulo: "text-cream/60",
    Tipo: GiCactus,
    Miniatura: GiPlantSeed,
    etapa: "Suculenta",
    evoluciona: "Crece desde una semilla",
    datos: "Planta viva",
    ilus: "Ilus. Vivero local",
    sabor: "Aguanta semanas sin riego. Prefiere el sol y el poco cariño.",
    descripcionBase:
      "Una vez por semana basta con un poco de agua. Déjala al sol y se encarga del resto.",
  },
};

/* ─── Tema de la carta (reverse holo dorado, marco plateado) ─── */
const MARCO_PAD = "3cqw 3cqw 4.5cqw"; // grosor del marco: arriba / lados / abajo (en % del ancho de la carta)

const TEMA = {
  marco: "linear-gradient(145deg,#e6e8ea 0%,#b7babe 50%,#d9dbdd 100%)",
  cuerpo: "linear-gradient(160deg,#f4e07e 0%,#e9c74c 50%,#f2d66a 100%)",
  texto: "#1c1706",
  energia: "radial-gradient(circle at 35% 30%, #fff3a0, #f2c230 75%)",
  energiaBorde: "#5a4310",
  incolora: "radial-gradient(circle at 35% 30%, #ffffff, #cfd1d3 75%)",
};

const PLATA =
  "linear-gradient(180deg,#ffffff 0%,#dfe2e4 40%,#a9aeb3 52%,#e9ecee 80%,#cfd3d6 100%)";

/* Patrón de piedras y rayos del fondo (reverse holo) */
const PATRON = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><g fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'><path d='M0 30 L40 10 L70 35 L55 70 L15 65 Z'/><path d='M70 35 L110 15 L150 40 L130 80 L90 75 Z'/><path d='M15 65 L55 70 L60 110 L25 130 L0 100 Z'/><path d='M55 70 L90 75 L105 120 L60 110 Z'/><path d='M90 75 L130 80 L150 120 L105 120 Z'/><path d='M25 130 L60 110 L105 120 L90 160 L30 160 Z'/></g><g fill='rgba(255,255,255,0.22)'><path d='M85 8 L100 8 L92 22 L102 22 L80 48 L86 28 L77 28 Z'/><path d='M20 100 L32 100 L26 112 L34 112 L16 134 L21 118 L14 118 Z'/><path d='M120 100 L132 100 L126 112 L134 112 L116 134 L121 118 L114 118 Z'/></g></svg>"
)}")`;

const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const fs = (n: number) => ({ fontSize: `${n}cqw` });
const pad = (n: number, l = 3) => String(n).padStart(l, "0");

function Energia({
  tipo,
  Icono,
  size = 5.4,
}: {
  tipo: "tipo" | "incolora";
  Icono: IconType;
  size?: number;
}) {
  const esTipo = tipo === "tipo";
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: `${size}cqw`,
        height: `${size}cqw`,
        background: esTipo ? TEMA.energia : TEMA.incolora,
        border: `0.35cqw solid ${esTipo ? TEMA.energiaBorde : "#3b3f41"}`,
        boxShadow: "0 0.2cqw 0.4cqw rgba(0,0,0,.3)",
        color: esTipo ? "#3a2a08" : "#2f3335",
        fontSize: `${size * 0.55}cqw`,
      }}
    >
      {esTipo ? <Icono /> : <FaStar />}
    </span>
  );
}

function Franja({
  children,
  className = "",
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex items-center ${className}`}
      style={{
        background: PLATA,
        clipPath: "polygon(1.5% 0, 100% 0, 98.5% 100%, 0 100%)",
        boxShadow: "0 0.3cqw 0.6cqw rgba(0,0,0,.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type CartaProps = {
  producto: Producto;
  tienda: Tienda;
  index: number;
  total: number;
  onAdd: () => void;
};

function CartaDestacada({ producto, tienda, index, total, onAdd }: CartaProps) {
  const cfg = CONFIG[tienda];
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 160, damping: 20 });
  const sy = useSpring(my, { stiffness: 160, damping: 20 });
  const sh = useSpring(hover, { stiffness: 120, damping: 20 });

  const rotateY = useTransform(sx, [0, 1], [-14, 14]);
  const rotateX = useTransform(sy, [0, 1], [14, -14]);

  const px = useTransform(sx, [0, 1], [0, 100]);
  const py = useTransform(sy, [0, 1], [0, 100]);
  const holoPos = useMotionTemplate`${px}% ${py}%`;
  const holoOpacity = useTransform(sh, [0, 1], [0.45, 0.95]);

  const glare = useMotionTemplate`radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,.6), rgba(255,255,255,0) 55%)`;
  const glareOpacity = useTransform(sh, [0, 1], [0, 0.75]);

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

  const irDetalle = () => router.push(`${cfg.base}/${producto.id}`);
  const precio = `$${producto.precio.toLocaleString("es-CL")}`;
  const tipo = producto.tipo ?? cfg.etapa;
  const Tipo = cfg.Tipo;
  const Miniatura = cfg.Miniatura;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full max-w-[320px]"
      style={{ perspective: 900 }}
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onClick={irDetalle}
        className="cursor-pointer"
      >
        {/* Contenedor de medidas: todo lo de adentro usa cqw relativo a esta carta */}
        <div
          className="relative aspect-[63/88] w-full"
          style={{ containerType: "inline-size" }}
        >
          {/* ===== Marco plateado ===== */}
          <div
            className="relative h-full w-full shadow-[0_12px_32px_rgba(0,0,0,.45)]"
            style={{
              background: TEMA.marco,
              padding: MARCO_PAD,
              borderRadius: "5cqw",
              color: TEMA.texto,
            }}
          >
            {/* ===== Cuerpo dorado ===== */}
            <div
              className="relative h-full w-full overflow-hidden"
              style={{ background: TEMA.cuerpo, borderRadius: "1.6cqw" }}
            >
              {/* Patrón de piedras */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: PATRON,
                  backgroundSize: "34cqw 34cqw",
                  opacity: 0.7,
                }}
              />
              {/* Emblema de rueda */}
              <div
                className="pointer-events-none absolute"
                style={{
                  width: "56cqw",
                  height: "56cqw",
                  right: "-8cqw",
                  top: "60cqw",
                  borderRadius: "50%",
                  border: "1.4cqw solid rgba(255,255,255,.35)",
                  backgroundImage:
                    "repeating-conic-gradient(rgba(255,255,255,.3) 0 9deg, transparent 9deg 18deg)",
                  opacity: 0.55,
                }}
              />
              {/* Reverse holo: brillo arcoíris sobre el fondo (la imagen queda por encima) */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  opacity: holoOpacity,
                  mixBlendMode: "overlay",
                  backgroundPosition: holoPos,
                  backgroundSize: "260% 260%",
                  backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(255,0,150,.6) 0%, rgba(255,210,0,.6) 14%, rgba(0,255,160,.6) 28%, rgba(0,200,255,.6) 42%, rgba(150,0,255,.6) 56%, rgba(255,0,150,.6) 70%)",
                }}
              />

              {/* ===== Contenido ===== */}
              <div className="relative z-10 flex h-full flex-col px-[5cqw]">
                {/* Encabezado */}
                <div className="relative flex h-[11cqw] shrink-0 items-center gap-[1.5cqw] pl-[16cqw] pt-[1cqw]">
                  {/* Stage */}
                  <div
                    className="absolute left-[-3cqw] top-[0.8cqw] z-10 flex h-[4cqw] max-w-[18cqw] items-center rounded-r-full px-[2cqw] font-extrabold italic uppercase leading-none"
                    style={{
                      ...fs(2.5),
                      background: PLATA,
                      boxShadow: "0 0.3cqw 0.6cqw rgba(0,0,0,.4)",
                    }}
                  >
                    <span className="truncate">{tipo}</span>
                  </div>

                  <h3
                    className="z-10 min-w-0 flex-1 truncate font-bold leading-none tracking-tight"
                    style={fs(5.8)}
                  >
                    {producto.nombre}
                  </h3>

                  {/* Franja plateada detrás del precio */}
                  <div
                    className="absolute right-[9cqw] top-[0.6cqw] h-[3cqw] w-[20cqw]"
                    style={{
                      background: PLATA,
                      clipPath: "polygon(0 0,100% 0,90% 100%,0 100%)",
                      opacity: 0.9,
                    }}
                  />

                  <div className="z-10 flex shrink-0 items-baseline gap-[0.8cqw]">
                    <span className="font-bold" style={fs(2.2)}>
                      PRECIO
                    </span>
                    <span className="font-extrabold leading-none" style={fs(5.2)}>
                      {precio}
                    </span>
                  </div>

                  <span
                    className="z-10 flex shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: "7.8cqw",
                      height: "7.8cqw",
                      background: TEMA.energia,
                      border: "0.6cqw solid #fff",
                      boxShadow:
                        "0 0 0 0.35cqw #c9a227, 0 0.4cqw 0.8cqw rgba(0,0,0,.4)",
                      color: "#3a2a08",
                      fontSize: "4.4cqw",
                    }}
                  >
                    <Tipo />
                  </span>
                </div>

                {/* Imagen */}
                <div
                  className="relative mt-[0.5cqw] h-[48cqw] shrink-0 overflow-hidden bg-[#d9c25a]"
                  style={{
                    border: "0.6cqw solid #d3d6d9",
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
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,#fff0a8,#e0b53a)]">
                      <Tipo className="text-black/20" style={fs(26)} />
                    </div>
                  )}

                  {/* Miniatura + pestaña "evoluciona de" sobre la imagen */}
                  <Franja
                    className="absolute left-0 top-0 z-10 h-[3.8cqw] w-[48cqw] pl-[13cqw] font-semibold italic"
                    style={{
                      ...fs(2.3),
                      clipPath: "polygon(0 0,100% 0,94% 100%,0 100%)",
                    }}
                  >
                    <span className="truncate">{cfg.evoluciona}</span>
                  </Franja>
                </div>

                {/* Miniatura circular (sobre el borde izquierdo de la imagen) */}
                <div
                  className="absolute left-[0cqw] top-[3.5cqw] z-20 flex items-center justify-center rounded-full"
                  style={{
                    width: "13.5cqw",
                    height: "13.5cqw",
                    background: PLATA,
                    border: "0.8cqw solid #b2b7ba",
                    boxShadow: "0 0.4cqw 0.8cqw rgba(0,0,0,.45)",
                    color: "#3a2a08",
                    fontSize: "7.6cqw",
                  }}
                >
                  <Miniatura />
                </div>

                {/* Franja de datos */}
                <Franja
                  className="-mx-[2.4cqw] mt-[0.8cqw] h-[4.2cqw] shrink-0 justify-center font-medium"
                  style={fs(2.2)}
                >
                  <span className="truncate px-[3cqw]">
                    NO. {pad(index + 1)}&nbsp;&nbsp;{tipo}&nbsp;&nbsp;{cfg.datos}
                  </span>
                </Franja>

                {/* Ataques */}
                <div className="mt-[3cqw] flex min-h-0 flex-1 flex-col gap-[2.2cqw]">
                  {/* Ataque 1: ver detalles (lleva la descripción) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      irDetalle();
                    }}
                    aria-label={`Ver detalles de ${producto.nombre}`}
                    className="group w-full rounded-[1cqw] px-[0.5cqw] py-[0.6cqw] text-left transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1c1706]"
                  >
                    <span className="flex items-center">
                      <span className="flex w-[22cqw] shrink-0">
                        <Energia tipo="incolora" Icono={Tipo} />
                      </span>
                      <span
                        className="flex-1 font-bold leading-none"
                        style={fs(4.8)}
                      >
                        Ver detalles
                      </span>
                    </span>
                    <span
                      className="mt-[0.8cqw] line-clamp-3 block leading-[1.22]"
                      style={fs(3.1)}
                    >
                      {producto.descripcion ?? cfg.descripcionBase}
                    </span>
                  </button>

                  {/* Ataque 2: añadir */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd();
                    }}
                    aria-label={`Añadir ${producto.nombre} al carrito`}
                    className="group w-full rounded-[1cqw] px-[0.5cqw] py-[0.6cqw] text-left transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1c1706]"
                  >
                    <span className="flex items-center">
                      <span className="flex w-[22cqw] shrink-0 gap-[0.6cqw]">
                        <Energia tipo="tipo" Icono={Tipo} />
                        <Energia tipo="tipo" Icono={Tipo} />
                        <Energia tipo="incolora" Icono={Tipo} />
                      </span>
                      <span
                        className="flex-1 font-bold leading-none"
                        style={fs(4.8)}
                      >
                        Añadir
                      </span>
                      <span
                        className="flex items-center gap-[1cqw] font-extrabold leading-none"
                        style={fs(5.2)}
                      >
                        +1
                        <MdAddShoppingCart className="transition-transform group-hover:scale-125" />
                      </span>
                    </span>
                    <span
                      className="mt-[0.8cqw] block leading-[1.22]"
                      style={fs(3.1)}
                    >
                      Suma 1 unidad al carrito por {precio}.
                    </span>
                  </button>
                </div>

                {/* Debilidad / resistencia / retirada */}
                <div className="-mx-[3.2cqw] mt-auto flex shrink-0 gap-[1.2cqw]">
                  <Franja
                    className="h-[4.8cqw] flex-[1.1] gap-[1.6cqw] pl-[3cqw] font-semibold"
                    style={fs(2.2)}
                  >
                    debilidad
                    <span
                      className="flex items-center justify-center rounded-full text-white"
                      style={{
                        width: "3.8cqw",
                        height: "3.8cqw",
                        background:
                          "radial-gradient(circle at 35% 30%,#6cc3ff,#1f78d1 70%)",
                        border: "0.3cqw solid #0e3d6b",
                        fontSize: "2.4cqw",
                      }}
                    >
                      <IoWater />
                    </span>
                    <span className="font-extrabold" style={fs(3.2)}>
                      ×2
                    </span>
                  </Franja>
                  <Franja
                    className="h-[4.8cqw] flex-1 pl-[3cqw] font-semibold"
                    style={fs(2.2)}
                  >
                    resistencia
                  </Franja>
                  <Franja
                    className="h-[4.8cqw] flex-1 gap-[1.4cqw] pl-[3cqw] font-semibold"
                    style={fs(2.2)}
                  >
                    retirada
                    <Energia tipo="incolora" Icono={Tipo} size={3.6} />
                  </Franja>
                </div>

                {/* Pie */}
                <div className="mt-[1.4cqw] mb-[1.6cqw] flex shrink-0 items-end justify-between gap-[2cqw]">
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold italic" style={fs(2.1)}>
                      {cfg.ilus}
                    </span>
                    <span className="font-bold" style={fs(2.7)}>
                      {pad(index + 1)}/{pad(total)} ◆
                    </span>
                  </div>
                  <p
                    className="max-w-[58%] text-right italic leading-[1.2]"
                    style={fs(2.3)}
                  >
                    {cfg.sabor}
                  </p>
                </div>
              </div>

              {/* Brillo que sigue al cursor */}
              <motion.div
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                  backgroundImage: glare,
                  opacity: glareOpacity,
                  mixBlendMode: "soft-light",
                }}
              />
            </div>

            {/* Copyright sobre el marco */}
            <span
              className="absolute inset-x-0 bottom-[1cqw] text-center"
              style={{ ...fs(1.8), color: TEMA.texto }}
            >
              ©{new Date().getFullYear()} {cfg.ilus.replace("Ilus. ", "")}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

/* ─────────────────────────  Sección  ───────────────────────── */
export default function ProductosDestacados({ tienda }: { tienda: Tienda }) {
  const { agregarItem } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);
  const cfg = CONFIG[tienda];

  useEffect(() => {
    CONFIG[tienda].cargar().then(setProductos).catch(() => {});
  }, [tienda]);

  // Sin destacados no se muestra la sección
  if (!productos.length) return null;

  return (
    <section id="destacados" className={`px-6 py-24 md:py-32 ${cfg.fondo}`}>
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className={`text-center text-3xl font-bold tracking-tight md:text-5xl ${cfg.colorTitulo}`}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          {cfg.titulo}
        </motion.h2>

        <motion.p
          className={`mt-4 text-center text-sm md:text-base ${cfg.colorSubtitulo}`}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {cfg.subtitulo}
        </motion.p>

        {/* flex-wrap + center: se ve bien con 1, 2, 3 o más destacados */}
        <div className="mt-16 flex flex-wrap justify-center gap-10">
          {productos.map((producto, i) => (
            <CartaDestacada
              key={producto.id}
              producto={producto}
              tienda={tienda}
              index={i}
              total={productos.length}
              onAdd={() =>
                agregarItem({
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  tienda,
                })
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}