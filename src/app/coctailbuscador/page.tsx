// app/coctailBuscador/page.tsx
import type { Metadata } from "next";
import type { Producto } from "@/app/types/productos";
import { obtenerCoctelesVisibles } from "@/app/actions/actions";
import BuscadorProductos from "../components/compartidos/Buscadorproductos";
import Navbar from "../components/compartidos/navbar";
import Footer from "../components/compartidos/Footer";

export const metadata: Metadata = { title: "Buscar cócteles | Cocteleria" };

// Para que el catálogo siempre esté al día
export const dynamic = "force-dynamic";

export default async function CoctailBuscadorPage() {
  const productos = await obtenerCoctelesVisibles().catch(() => [] as Producto[]);

  return (
<>
<Navbar tema="cocteleria"/>
<BuscadorProductos tienda="cocteleria" productos={productos} />
<Footer tienda="cocteleria"/>

</>
  )
}