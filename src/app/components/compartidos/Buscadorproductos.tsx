"use client";

import { useMemo, useState } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { useCart } from "@/context/CartContext";
import type { Producto } from "@/app/types/productos";
import CartaCocteleria from "../cocteleria/Cartacocteleria";
import CartaSuculenta from "../suculentas/Cartasuculenta";

type Tienda = "cocteleria" | "suculentas";

/* ─── Colores y textos por tienda (clases completas para que Tailwind las detecte) ─── */
const CONFIG = {
  cocteleria: {
    Carta: CartaCocteleria,
    fondo: "bg-pastel-peach",
    titulo: "text-pastel-brown",
    suave: "text-pastel-brown/60",
    input:
      "border-pastel-brown/20 bg-white/70 text-pastel-brown placeholder:text-pastel-brown/50 focus:border-pastel-red focus:ring-pastel-red/25",
    icono: "text-pastel-brown/60",
    heading: "Encuentra tu cóctel",
    subheading: "Busca por nombre, tipo o ingredientes",
    placeholder: "Buscar cócteles…",
    vacio: "No encontramos cócteles con esa búsqueda.",
  },
  suculentas: {
    Carta: CartaSuculenta,
    fondo: "bg-terra-dark",
    titulo: "text-cream",
    suave: "text-cream/60",
    input:
      "border-cream/25 bg-cream/10 text-cream placeholder:text-cream/50 focus:border-cream focus:ring-cream/25",
    icono: "text-cream/60",
    heading: "Encuentra tu planta",
    subheading: "Busca por nombre, tipo o descripción",
    placeholder: "Buscar plantas…",
    vacio: "No encontramos plantas con esa búsqueda.",
  },
} as const;

/* Sin tildes ni mayúsculas: "Cóctel" coincide con "coctel" */
const normalizar = (s?: string | null) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function BuscadorProductos({
  tienda,
  productos,
}: {
  tienda: Tienda;
  productos: Producto[];
}) {
  const { agregarItem } = useCart();
  const [consulta, setConsulta] = useState("");
  const cfg = CONFIG[tienda];
  const Carta = cfg.Carta;

  // Guardamos la posición original para que el número de carta no cambie al filtrar
  const filtrados = useMemo(() => {
    const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
    const todos = productos.map((producto, posicion) => ({ producto, posicion }));
    if (!palabras.length) return todos;

    return todos.filter(({ producto }) => {
      const texto = normalizar(
        `${producto.nombre} ${producto.tipo ?? ""} ${producto.descripcion ?? ""}`
      );
      return palabras.every((p) => texto.includes(p));
    });
  }, [consulta, productos]);

  return (
    // pt-28 / md:pt-32 = alto del menú flotante
    <div className={`min-h-screen w-full px-6 pb-24 pt-28 md:pt-32 ${cfg.fondo}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        {/* ===== 1. Buscador ===== */}
        <div className="flex flex-col items-center gap-5 text-center">
          <h1
            className={`text-3xl font-bold tracking-tight md:text-5xl ${cfg.titulo}`}
          >
            {cfg.heading}
          </h1>
          <p className={`text-sm md:text-base ${cfg.suave}`}>{cfg.subheading}</p>

          <div className="relative w-full max-w-xl">
            <HiMagnifyingGlass
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl ${cfg.icono}`}
            />
            <input
              type="text"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder={cfg.placeholder}
              aria-label={cfg.placeholder}
              autoComplete="off"
              className={`w-full rounded-full border py-3.5 pl-12 pr-12 text-base outline-none transition focus:ring-4 ${cfg.input}`}
            />
            {consulta && (
              <button
                type="button"
                onClick={() => setConsulta("")}
                aria-label="Limpiar búsqueda"
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-xl transition-opacity hover:opacity-70 ${cfg.icono}`}
              >
                <HiXMark />
              </button>
            )}
          </div>

          <p className={`text-xs ${cfg.suave}`} aria-live="polite">
            {filtrados.length} de {productos.length}{" "}
            {productos.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {/* ===== 2. Grid de cartas ===== */}
        <div>
          {filtrados.length ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {filtrados.map(({ producto, posicion }, i) => (
                <Carta
                  key={producto.id}
                  producto={producto}
                  index={posicion}
                  total={productos.length}
                  orden={i}
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
          ) : (
            <p className={`py-16 text-center text-base ${cfg.suave}`}>
              {cfg.vacio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}