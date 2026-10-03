// app/suculentaBuscador/page.tsx
import type { Metadata } from "next";
import type { Producto } from "@/app/types/productos";
import { obtenerSuculentasVisibles } from "@/app/actions/actions";
import BuscadorProductos from "../components/compartidos/Buscadorproductos";
import Navbar from "../components/compartidos/navbar";
import Footer from "../components/compartidos/Footer";

export const metadata: Metadata = { title: "Buscar plantas | Suculentas" };

// Para que el catálogo siempre esté al día
export const dynamic = "force-dynamic";

export default async function SuculentaBuscadorPage() {
  const productos = await obtenerSuculentasVisibles().catch(() => [] as Producto[]);

  return(
    <>
    <Navbar tema="suculentas"/>
    <BuscadorProductos tienda="suculentas" productos={productos} />
    <Footer tienda="suculentas"/>
    </>
) 
    
}