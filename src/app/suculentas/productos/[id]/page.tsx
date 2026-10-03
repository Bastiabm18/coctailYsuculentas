// app/suculentas/productos/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Producto } from "@/app/types/productos";
import {
  obtenerSuculentasVisibles,
  obtenerSuculentaPorId,
} from "@/app/actions/actions";
import DetalleSuculenta from "@/app/components/suculentas/Detallesuculenta";
import Navbar from "@/app/components/compartidos/navbar";
import Footer from "@/app/components/compartidos/Footer";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const producto = await obtenerSuculentaPorId(id);

  return {
    title: producto ? `${producto.nombre} | Suculentas` : "Planta no encontrada",
  };
}

export default async function ProductoSuculentaPage({ params }: Params) {
  const { id } = await params;

  // La suculenta se busca directo por id. La lista solo sirve para el número de carta (001/012).
  const [producto, lista] = await Promise.all([
    obtenerSuculentaPorId(id),
    obtenerSuculentasVisibles().catch(() => [] as Producto[]),
  ]);

  if (!producto) notFound();

  const posicion = lista.findIndex((p) => String(p.id) === String(producto.id));

  return (
    <>
    <Navbar tema="suculentas" />
    <DetalleSuculenta
      producto={producto}
      index={posicion >= 0 ? posicion : 0}
      total={lista.length || 1}
      />
      <Footer tienda="suculentas" />
      </>
  );
}