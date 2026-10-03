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
import { GiCactus, GiPlantSeed } from "react-icons/gi";
import { FaStar, FaSyncAlt } from "react-icons/fa";
import { IoWater, IoSunny, IoLeaf } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import { HiArrowLeft } from "react-icons/hi2";
import { useCart } from "@/context/CartContext";
import type { Producto } from "@/app/types/productos";

/* `cuidados` es un jsonb: acepta objeto {riego:"..."}, arreglo de textos o arreglo de {titulo,texto} */
export type ProductoSuculenta = Producto & { cuidados?: unknown };

/* ---------- Grosor del marco amarillo (en cqw = % del ancho de la carta): arriba / lados / abajo ---------- */
const MARCO_PAD = "4.5cqw 4.5cqw 6.5cqw";

/* ---------- Tema (estilo Venusaur · tipo planta) ---------- */
const TEMA = {
  marco: "linear-gradient(135deg,#f6ec52 0%,#e9da2e 55%,#d9d02a 100%)",
  cuerpo:
    "radial-gradient(circle at 50% 64%, rgba(255,255,255,.45), transparent 60%), radial-gradient(circle at 8% 14%, rgba(255,255,160,.55), transparent 45%), linear-gradient(180deg,#b9de72 0%,#92cc5c 38%,#7cc24f 66%,#a9d974 100%)",
  reverso:
    "radial-gradient(circle at 50% 40%, #3f8f3a 0%, #226a2c 55%, #0f3a1a 100%)",
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

const fs = (n: number) => ({ fontSize: `${n}cqw` });
const pad = (n: number, l = 3) => String(n).padStart(l, "0");

/* ---------- Normaliza el jsonb de cuidados a filas clave/valor ---------- */
type Cuidado = { clave: string; valor: string };

function normalizarCuidados(c: unknown): Cuidado[] {
  if (!c) return [];

  if (typeof c === "string") {
    try {
      return normalizarCuidados(JSON.parse(c));
    } catch {
      return [{ clave: "Cuidado", valor: c }];
    }
  }

  if (Array.isArray(c)) {
    return c.flatMap((it, i): Cuidado[] => {
      if (typeof it === "string") return [{ clave: `Cuidado ${i + 1}`, valor: it }];
      if (it && typeof it === "object") {
        const o = it as Record<string, unknown>;
        const clave = String(o.titulo ?? o.nombre ?? o.clave ?? o.tipo ?? `Cuidado ${i + 1}`);
        const valor = String(o.texto ?? o.descripcion ?? o.valor ?? "");
        return valor ? [{ clave, valor }] : [];
      }
      return [];
    });
  }

  if (typeof c === "object") {
    return Object.entries(c as Record<string, unknown>)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => ({
        clave: k.replace(/_/g, " "),
        valor: Array.isArray(v) ? v.join(", ") : String(v),
      }));
  }

  return [];
}

const CUIDADOS_POR_DEFECTO: Cuidado[] = [
  { clave: "Riego", valor: "Poca agua. Deja secar la tierra entre riegos." },
  { clave: "Luz", valor: "Mucha luz, con sol directo suave." },
  { clave: "Sustrato", valor: "Mezcla drenante, sin acumular humedad." },
];

function iconoCuidado(clave: string) {
  const k = clave.toLowerCase();
  if (k.includes("rieg") || k.includes("agua")) return <IoWater />;
  if (k.includes("luz") || k.includes("sol")) return <IoSunny />;
  return <IoLeaf />;
}

/* ---------- Valores animados compartidos por ambas caras ---------- */
type Fx = {
  holoPos: MotionValue<string>;
  holoOpacity: MotionValue<number>;
  glare: MotionValue<string>;
  glareOpacity: MotionValue<number>;
};

function Energia({
  tipo,
  size = 6,
}: {
  tipo: "pasto" | "incolora";
  size?: number;
}) {
  const pasto = tipo === "pasto";
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
      {pasto ? <GiCactus /> : <FaStar />}
    </span>
  );
}

/* Marco amarillo: es HIJO del contenedor (containerType), así los cqw se miden contra la carta */
function Marco({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative h-full w-full shadow-[0_12px_32px_rgba(0,0,0,.45)]"
      style={{
        background: TEMA.marco,
        padding: MARCO_PAD,
        borderRadius: "4cqw",
        color: TEMA.texto,
      }}
    >
      {children}
      <span
        className="absolute inset-x-0 bottom-[1.6cqw] text-center"
        style={{ ...fs(1.8), color: TEMA.texto }}
      >
        ©{new Date().getFullYear()} Suculentas / Vivero
      </span>
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
  producto: ProductoSuculenta;
  index: number;
  total: number;
  onAdd: () => void;
  fx: Fx;
}) {
  const precio = `$${producto.precio.toLocaleString("es-CL")}`;
  const tipo = producto.tipo ?? "Suculenta";

  return (
    <Marco>
      <div
        className="relative flex h-full w-full flex-col overflow-hidden px-[4.5cqw]"
        style={{ background: TEMA.cuerpo, borderRadius: "1.2cqw" }}
      >
        {/* Encabezado */}
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
              boxShadow: "0 0 0 0.35cqw #1c8a34, 0 0.4cqw 0.8cqw rgba(0,0,0,.4)",
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
              opacity: fx.holoOpacity,
              mixBlendMode: "color-dodge",
              backgroundPosition: fx.holoPos,
              backgroundSize: "260% 260%, 14px 14px",
              backgroundImage:
                "repeating-linear-gradient(115deg, rgba(255,0,150,.5) 0%, rgba(255,210,0,.5) 14%, rgba(0,255,160,.5) 28%, rgba(0,200,255,.5) 42%, rgba(150,0,255,.5) 56%, rgba(255,0,150,.5) 70%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.9) 0 1px, transparent 1.5px)",
            }}
          />
        </div>

        {/* Fila evolución */}
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

        {/* Planta-BODY */}
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
          <p className="mt-[1.2cqw] line-clamp-3 leading-[1.22]" style={fs(3.3)}>
            {producto.descripcion ??
              "Una vez por semana basta con un poco de agua. Déjala al sol y se encarga del resto."}
          </p>

          {/* Ataque = añadir */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Añadir ${producto.nombre} al carrito`}
            className="group mt-[2.4cqw] w-full rounded-[1cqw] px-[0.5cqw] py-[0.8cqw] text-left transition-colors hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16240f]"
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
          <span>Toca la carta para girarla</span>
          <span className="font-bold" style={fs(2.6)}>
            {pad(index + 1)}/{pad(total)} ★
          </span>
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
  producto: ProductoSuculenta;
  index: number;
  total: number;
  fx: Fx;
}) {
  const cuidadosDb = normalizarCuidados(producto.cuidados);
  const cuidados = (cuidadosDb.length ? cuidadosDb : CUIDADOS_POR_DEFECTO).slice(0, 5);
  const precio = `$${producto.precio.toLocaleString("es-CL")}`;

  return (
    <Marco>
      <div
        className="relative flex h-full w-full flex-col overflow-hidden px-[4.5cqw] py-[4cqw]"
        style={{
          background: TEMA.reverso,
          borderRadius: "1.2cqw",
          color: "#eaf7d8",
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
          <GiCactus />
        </div>

        {/* Encabezado */}
        <div className="relative z-10 text-center">
          <p
            className="font-bold uppercase tracking-[0.3em] text-[#e9da2e]"
            style={fs(2.3)}
          >
            Ficha de cuidados
          </p>
          <h3
            className="mt-[0.8cqw] truncate font-extrabold leading-none"
            style={fs(7)}
          >
            {producto.nombre}
          </h3>
          <div className="mx-auto mt-[2cqw] h-[0.5cqw] w-[30cqw] rounded-full bg-[#e9da2e]" />
        </div>

        {/* Secciones */}
        <div className="relative z-10 mt-[3.5cqw] flex min-h-0 flex-1 flex-col gap-[3cqw] overflow-hidden">
          <Seccion titulo="Cuidados">
            <ul className="flex flex-col gap-[1.8cqw]">
              {cuidados.map(({ clave, valor }) => (
                <li key={clave} className="flex items-start gap-[2cqw]">
                  <span
                    className="mt-[0.2cqw] flex shrink-0 items-center justify-center rounded-full bg-[#e9da2e] text-[#16240f]"
                    style={{ width: "5.4cqw", height: "5.4cqw", fontSize: "3.2cqw" }}
                  >
                    {iconoCuidado(clave)}
                  </span>
                  <div className="min-w-0 leading-tight">
                    <p className="font-extrabold capitalize" style={fs(3)}>
                      {clave}
                    </p>
                    <p className="line-clamp-2 opacity-90" style={fs(2.8)}>
                      {valor}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Seccion>

          <Seccion titulo="Detalles">
            <dl
              className="grid grid-cols-[auto_1fr] gap-x-[4cqw] gap-y-[1cqw]"
              style={fs(2.9)}
            >
              <dt className="font-semibold opacity-70">Tipo</dt>
              <dd className="text-right font-bold">{producto.tipo ?? "Suculenta"}</dd>
              <dt className="font-semibold opacity-70">Precio</dt>
              <dd className="text-right font-bold">{precio}</dd>
            </dl>
          </Seccion>
        </div>

        {/* Pie */}
        <div
          className="relative z-10 mt-[2cqw] flex items-center justify-between font-semibold opacity-80"
          style={fs(2.2)}
        >
          <span>Colección Suculentas</span>
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
export default function DetalleSuculenta({
  producto,
  index,
  total,
}: {
  producto: ProductoSuculenta;
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
    holoOpacity: useTransform(sh, [0, 1], [0.35, 0.9]),
    glare: useMotionTemplate`radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,.6), rgba(255,255,255,0) 55%)`,
    glareOpacity: useTransform(sh, [0, 1], [0, 0.75]),
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
      tienda: "suculentas",
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
    <section className="min-h-screen bg-terra-dark px-6 pb-24 pt-28 md:pt-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <div className="w-full">
          <Link
            href="/suculentas#productos"
            className="inline-flex items-center gap-2 text-sm font-medium text-cream/70 transition-colors hover:text-cream"
          >
            <HiArrowLeft />
            Volver a las plantas
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
              <div style={{ ...cara, pointerEvents: volteada ? "none" : "auto" }}>
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
            className="flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-xs font-medium tracking-wider uppercase text-cream transition-all hover:bg-cream hover:text-terra"
          >
            <FaSyncAlt />
            {volteada ? "Ver frente" : "Ver reverso"}
          </button>
          <button
            type="button"
            onClick={agregar}
            className="flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-xs font-medium tracking-wider uppercase text-terra transition-all hover:bg-cream/90"
          >
            Añadir al carrito
            <MdAddShoppingCart />
          </button>
        </div>
      </div>
    </section>
  );
}