// app/cocteleria/productos/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Producto } from "@/app/types/productos";
import {
  obtenerCoctelesVisibles,
  obtenerProductoPorId,
} from "@/app/actions/actions";
import DetalleCoctel from "@/app/components/cocteleria/Detallecoctel";
import Navbar from "@/app/components/compartidos/navbar";
import Footer from "@/app/components/compartidos/Footer";


type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const producto = await obtenerProductoPorId(id);
 // console.log("Producto encontrado para metadata:", producto);

  return {
    title: producto ? `${producto.nombre} | Cocteleria` : "Producto no encontrado",
  };
}

export default async function ProductoCocteleriaPage({ params }: Params) {
  const { id } = await params;

  // El producto se busca directo por id (no depende de la lista del menú).
  // La lista solo se usa para calcular el número de carta (001/012).
  const [producto, lista] = await Promise.all([
    obtenerProductoPorId(id),
    obtenerCoctelesVisibles().catch(() => [] as Producto[]),
  ]);

  if (!producto) notFound();

  const posicion = lista.findIndex((p) => String(p.id) === String(producto.id));

  return (
    <>
    <Navbar tema="cocteleria" />
    <DetalleCoctel
      producto={producto}
      index={posicion >= 0 ? posicion : 0}
      total={lista.length || 1}
      />
      <Footer tienda="cocteleria" />
      </>
  );
}