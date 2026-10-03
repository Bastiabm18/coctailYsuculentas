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
import { GiCactus, GiPlantSeed } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { IoWater } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import { useCart } from "@/context/CartContext";
import type { Producto } from "@/app/types/productos";
import { obtenerSuculentasVisibles } from "@/app/actions/actions";
 
/* ---------- Tema de la carta (cambia estos valores para otro "tipo") ---------- */
const TEMA = {
  marco: "#f8df62", // borde amarillo
  cuerpo:
    "radial-gradient(circle at 15% 75%, rgba(255,180,100,.35), transparent 40%), radial-gradient(circle at 85% 45%, rgba(255,170,90,.3), transparent 45%), linear-gradient(180deg,#ee5835 0%,#f2693a 50%,#f58540 100%)",
  energia: "radial-gradient(circle at 35% 30%, #ff6a55, #d22b1e 70%)",
  energiaIcono: "#ffd9cc",
  habilidadNombre: "#9a1117",
  texto: "#3b140c",
};
 
/* Metal plateado de las franjas */
const PLATA =
  "linear-gradient(180deg,#ffffff 0%,#dfe2e4 40%,#a9aeb3 52%,#e9ecee 80%,#cfd3d6 100%)";
 
const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};
 
/* Todos los tamaños usan cqw (1cqw = 1% del ancho de la carta), así escala sola */
const fs = (n: number) => ({ fontSize: `${n}cqw` });
 
function Energia({ size = 6.5 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: `${size}cqw`,
        height: `${size}cqw`,
        background: TEMA.energia,
        border: "0.45cqw solid #fff",
        boxShadow: "0 0 0 0.25cqw #7a1710",
        color: TEMA.energiaIcono,
        fontSize: `${size * 0.55}cqw`,
      }}
    >
      <GiCactus />
    </span>
  );
}
 
function Franja({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
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
  index: number;
  total: number;
  onAdd: () => void;
};
 
function CartaSuculenta({ producto, index, total, onAdd }: CartaProps) {
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
  const holoOpacity = useTransform(sh, [0, 1], [0.35, 0.9]);
 
  const glare = useMotionTemplate`radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,.6), rgba(255,255,255,0) 55%)`;
  const glareOpacity = useTransform(sh, [0, 1], [0, 0.75]);
 
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
 
  const pad = (n: number, l = 3) => String(n).padStart(l, "0");
  const precio = `$${producto.precio.toLocaleString("es-CL")}`;
  const tipo = producto.tipo ?? "Suculenta";
 
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mx-auto w-full max-w-[340px]"
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          containerType: "inline-size",
          background: TEMA.marco,
          padding: "1.5cqw 1.5cqw 3cqw",
          borderRadius: "4cqw",
          color: TEMA.texto,
        }}
        className="relative aspect-[63/88] w-full shadow-[0_12px_32px_rgba(0,0,0,.45)]"
      >
        {/* ================= Cuerpo naranja ================= */}
        <div
          className="relative flex h-full w-full flex-col overflow-hidden px-[4cqw]"
          style={{ background: TEMA.cuerpo, borderRadius: "1.2cqw" }}
        >
          {/* ---------- Encabezado ---------- */}
          <div className="relative flex h-[13cqw] shrink-0 items-center pl-[15.5cqw]">
            {/* Stage */}
            <div
              className="absolute left-[-2.5cqw] top-[1.2cqw] z-10 flex h-[4.4cqw] max-w-[17cqw] items-center rounded-full px-[1.6cqw] font-extrabold italic leading-none"
              style={{
                ...fs(2.5),
                background: PLATA,
                boxShadow: "0 0.3cqw 0.6cqw rgba(0,0,0,.4)",
              }}
            >
              <span className="truncate uppercase">{tipo}</span>
            </div>
 
            {/* Nombre */}
            <h3
              className="z-10 min-w-0 flex-1 truncate font-extrabold leading-none tracking-tight"
              style={{ ...fs(6.4), color: "#1a0a06" }}
            >
              {producto.nombre}
            </h3>
 
            {/* Franja plateada detrás del precio */}
            <div
              className="absolute right-[10cqw] top-[0.5cqw] h-[3.4cqw] w-[20cqw]"
              style={{
                background: PLATA,
                clipPath: "polygon(0 0,100% 0,88% 100%,0 100%)",
                opacity: 0.9,
              }}
            />
 
            {/* Precio */}
            <div className="z-10 ml-[1.5cqw] flex shrink-0 items-baseline gap-[0.8cqw]">
              <span className="font-bold" style={fs(2.4)}>
                PRECIO
              </span>
              <span className="font-extrabold leading-none" style={fs(5.2)}>
                {precio}
              </span>
            </div>
 
            {/* Tipo (círculo) */}
            <span
              className="z-10 ml-[1.5cqw] flex shrink-0 items-center justify-center rounded-full"
              style={{
                width: "9.5cqw",
                height: "9.5cqw",
                background: "radial-gradient(circle at 35% 30%,#ff7a5f,#d8321f 70%)",
                border: "0.7cqw solid #fff",
                boxShadow: "0 0 0 0.35cqw #d8321f, 0 0.4cqw 0.8cqw rgba(0,0,0,.4)",
                color: "#fff",
                fontSize: "5.2cqw",
              }}
            >
              <GiCactus />
            </span>
          </div>
 
          {/* ---------- Imagen + holo ---------- */}
          <div className="relative -mx-[1cqw] h-[50cqw] shrink-0">
            <div
              className="relative h-full w-full overflow-hidden bg-[#fbd9a0]"
              style={{
                border: "0.6cqw solid #dfe3e6",
                boxShadow: "0 0 1.2cqw rgba(0,0,0,.45) inset, 0.6cqw 0.6cqw 1cqw rgba(0,0,0,.3)",
              }}
            >
              {producto.imagen_url ? (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,#ffe9b5,#f3a550)]">
                  <GiCactus className="text-black/20" style={fs(26)} />
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
                    "repeating-linear-gradient(115deg, rgba(255,0,150,.5) 0%, rgba(255,210,0,.5) 14%, rgba(0,255,160,.5) 28%, rgba(0,200,255,.5) 42%, rgba(150,0,255,.5) 56%, rgba(255,0,150,.5) 70%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.9) 0 1px, transparent 1.5px)",
                }}
              />
            </div>
 
            {/* Miniatura "evoluciona de" */}
            <div
              className="absolute left-[-3cqw] top-[-7cqw] z-10 flex items-center justify-center rounded-[1.6cqw] bg-gradient-to-b from-white to-[#d9dde0]"
              style={{
                width: "12.5cqw",
                height: "12.5cqw",
                border: "0.5cqw solid #c4c9cd",
                boxShadow: "0 0.4cqw 0.8cqw rgba(0,0,0,.4)",
                color: "#3f7a3a",
                fontSize: "8cqw",
              }}
            >
              <GiPlantSeed />
            </div>
 
            {/* Pestaña "Evoluciona de" */}
            <Franja
              className="absolute left-[10cqw] top-[0.6cqw] z-10 h-[4.4cqw] w-[42cqw] pl-[4cqw] font-semibold italic"
              style={{
                ...fs(2.6),
                clipPath: "polygon(0 0,100% 0,93% 100%,0 100%)",
              }}
            >
              <span className="truncate">Crece desde una semilla</span>
            </Franja>
          </div>
 
          {/* ---------- Franja de datos ---------- */}
          <Franja
            className="-mx-[2.4cqw] mt-[0.6cqw] h-[4.6cqw] shrink-0 justify-center font-medium"
            style={fs(2.4)}
          >
            <span className="truncate px-[3cqw]">
              NO. {pad(index + 1)}&nbsp;&nbsp;{tipo}&nbsp;&nbsp;Planta viva
            </span>
          </Franja>
 
          {/* ---------- Habilidad + ataque ---------- */}
          <div className="mt-[3cqw] flex min-h-0 flex-1 flex-col">
            {/* Habilidad */}
            <div className="flex items-center gap-[2.2cqw]">
              <span
                className="flex h-[5.4cqw] shrink-0 items-center justify-center px-[3.6cqw] font-extrabold italic leading-none text-white"
                style={{
                  ...fs(3.4),
                  background:
                    "linear-gradient(180deg,#ff6a5c 0%,#c4161c 55%,#8e0f14 100%)",
                  clipPath: "polygon(3% 0,100% 0,96% 100%,0 100%)",
                  boxShadow: "0 0 0 0.3cqw #d5d9dc",
                }}
              >
                Habilidad
              </span>
              <span
                className="truncate font-extrabold leading-none"
                style={{ ...fs(4.6), color: TEMA.habilidadNombre }}
              >
                Poca agua
              </span>
            </div>
            <p
              className="mt-[1.4cqw] line-clamp-3 leading-[1.22]"
              style={fs(3.3)}
            >
              {producto.descripcion ??
                "Una vez por semana basta con un poco de agua. Déjala al sol y se encarga del resto."}
            </p>
 
            {/* Ataque = botón añadir */}
            <motion.button
              type="button"
              onClick={onAdd}
              whileTap={{ scale: 0.98 }}
              aria-label={`Añadir ${producto.nombre} al carrito`}
              className="group mt-[2.6cqw] w-full rounded-[1cqw] px-[0.5cqw] py-[0.8cqw] text-left transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2b2b2b]"
            >
              <span className="flex items-center">
                <span className="flex w-[15.5cqw] shrink-0 gap-[0.8cqw]">
                  <Energia />
                  <Energia />
                </span>
                <span
                  className="flex-1 font-extrabold leading-none"
                  style={{ ...fs(4.6), color: "#1a0a06" }}
                >
                  Añadir
                </span>
                <span
                  className="flex items-center gap-[1cqw] font-extrabold leading-none"
                  style={{ ...fs(5.2), color: "#1a0a06" }}
                >
                  +1
                  <MdAddShoppingCart className="transition-transform group-hover:scale-125" />
                </span>
              </span>
              <span className="mt-[1cqw] block leading-[1.22]" style={fs(3.3)}>
                Esta acción suma 1 unidad al carrito por {precio}.
              </span>
            </motion.button>
          </div>
 
          {/* ---------- Debilidad / resistencia / retirada ---------- */}
          <div className="-mx-[3.2cqw] mt-auto flex shrink-0 gap-[1.2cqw]">
            <Franja
              className="h-[4.8cqw] flex-[1.1] gap-[1.6cqw] pl-[3cqw] font-bold"
              style={fs(2.4)}
            >
              debilidad
              <span
                className="flex items-center justify-center rounded-full text-white"
                style={{
                  width: "3.8cqw",
                  height: "3.8cqw",
                  background: "radial-gradient(circle at 35% 30%,#6cc3ff,#1f78d1 70%)",
                  border: "0.3cqw solid #fff",
                  fontSize: "2.4cqw",
                }}
              >
                <IoWater />
              </span>
              <span className="font-extrabold" style={fs(3.4)}>
                ×2
              </span>
            </Franja>
            <Franja
              className="h-[4.8cqw] flex-1 pl-[3cqw] font-bold"
              style={fs(2.4)}
            >
              resistencia
            </Franja>
            <Franja
              className="h-[4.8cqw] flex-1 gap-[1.4cqw] pl-[3cqw] font-bold"
              style={fs(2.4)}
            >
              retirada
              <span className="flex gap-[0.5cqw]">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="flex items-center justify-center rounded-full bg-white text-[#333]"
                    style={{
                      width: "3.4cqw",
                      height: "3.4cqw",
                      border: "0.25cqw solid #777",
                      fontSize: "2cqw",
                    }}
                  >
                    <FaStar />
                  </span>
                ))}
              </span>
            </Franja>
          </div>
 
          {/* ---------- Pie ---------- */}
          <div className="mt-[1.8cqw] mb-[1.6cqw] flex shrink-0 items-end justify-between gap-[2cqw]">
            <div className="flex flex-col leading-tight">
              <span className="font-semibold italic" style={fs(2.2)}>
                Ilus. Vivero local
              </span>
              <span className="font-bold" style={fs(2.9)}>
                {pad(index + 1)}/{pad(total)} ★
              </span>
            </div>
            <p
              className="max-w-[55%] text-right italic leading-[1.2]"
              style={fs(2.5)}
            >
              Aguanta semanas sin riego. Prefiere el sol y el poco cariño.
            </p>
          </div>
 
          {/* Brillo que sigue al cursor */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: glare,
              opacity: glareOpacity,
              mixBlendMode: "soft-light",
            }}
          />
        </div>
 
        {/* Copyright sobre el marco amarillo */}
        <span
          className="absolute inset-x-0 bottom-[0.9cqw] text-center"
          style={{ ...fs(1.9), color: TEMA.texto }}
        >
          ©{new Date().getFullYear()} Suculentas / Vivero
        </span>
      </motion.div>
    </motion.article>
  );
}
 
export default function ProductosSuculentas() {
  const { agregarItem } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);
 
  useEffect(() => {
    obtenerSuculentasVisibles().then(setProductos).catch(() => {});
  }, []);
 
  return (
    <section id="productos" className="bg-terra-dark px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-neutral-100 text-3xl font-bold tracking-tight md:text-5xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          Nuestras plantas
        </motion.h2>
 
        <motion.p
          className="mt-4 text-center text-neutral-100/50 text-sm md:text-base"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Selección cuidada especie por especie
        </motion.p>
 
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, i) => (
            <CartaSuculenta
              key={producto.id}
              producto={producto}
              index={i}
              total={productos.length}
              onAdd={() =>
                agregarItem({
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  tienda: "suculentas",
                })
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
 


