"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { suscribirCorreo } from "@/app/actions/actions";

type Tienda = "cocteleria" | "suculentas";

/* Clases completas para que Tailwind las detecte */
const CONFIG: Record<
  Tienda,
  {
    imagen: string;
    fondo: string;
    panel: string;
    colorTitulo: string;
    colorTexto: string;
    boton: string;
    foco: string;
  }
> = {
  cocteleria: {
    imagen: "/cocteles.jpg", // <-- cambia por tu imagen
    fondo: "bg-pastel-peach",
    panel: "bg-white",
    colorTitulo: "text-pastel-brown",
    colorTexto: "text-pastel-brown/70",
    boton: "bg-pastel-red hover:bg-pastel-red-hover",
    foco: "focus:border-pastel-red focus:ring-pastel-red/20",
  },
  suculentas: {
    imagen: "/cactus.jpg", // <-- cambia por tu imagen
    fondo: "bg-terra-dark",
    panel: "bg-cream",
    colorTitulo: "text-terra-dark",
    colorTexto: "text-terra-dark/70",
    boton: "bg-terra hover:bg-terra-hover",
    foco: "focus:border-terra focus:ring-terra/20",
  },
};

export default function SuscripcionSeccion({ tienda }: { tienda: Tienda }) {
  const cfg = CONFIG[tienda];

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await suscribirCorreo(nombre, email, tienda);
      setEnviado(true);
    } catch {
      setError("No pudimos suscribirte. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  const input = `w-full rounded-md border border-black/80 bg-white px-4 py-3 text-base text-black outline-none transition focus:ring-2 ${cfg.foco}`;

  return (
    <section id="suscripcion" className={`px-6 py-24 md:py-32 ${cfg.fondo}`}>
      <motion.div
        className="mx-auto flex max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        {/* Imagen (solo desde md) */}
        <div className="hidden w-1/2 md:block">
          <img src={cfg.imagen} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Panel */}
        <div className={`flex w-full flex-col justify-center p-8 md:w-1/2 md:p-10 ${cfg.panel}`}>
          {enviado ? (
            <div className="py-10 text-center">
              <p className={`text-2xl font-bold ${cfg.colorTitulo}`}>¡Listo, ya eres parte!</p>
              <p className={`mt-2 text-sm ${cfg.colorTexto}`}>
                Revisa tu correo para tu 10% OFF.
              </p>
            </div>
          ) : (
            <form onSubmit={enviar}>
              <h2 className={`text-2xl font-bold leading-tight md:text-[1.7rem] ${cfg.colorTitulo}`}>
                Suscríbete a nuestra lista de correos y obtén un 10% OFF en tu primera compra
              </h2>

              <div className="mt-6 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={input}
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={input}
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={enviando}
                className={`mt-4 w-full rounded-md px-5 py-3 text-base font-bold text-white transition disabled:opacity-60 ${cfg.boton}`}
              >
                {enviando ? "Enviando..." : "Suscribirme"}
              </button>

              <p className={`mt-5 text-center text-xs ${cfg.colorTexto}`}>
                Respetamos tu privacidad, no vamos a compartir tu email con nadie.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}