"use client"
import AuthModal from "../components/compartidos/AuthModal";
import Navbar from "../components/compartidos/navbar";
import ContactoSuculentas from "../components/suculentas/ContactoSuculentas";
import HeroSuculentas from "../components/suculentas/HeroSuculentas";
import NosotrosSuculentas from "../components/suculentas/NosotrosSuculentas";
import ProductosSuculentas from "../components/suculentas/ProductosSuculentas";
import ContenedorNoticias from "../components/noticias/ContenedorTarjetas";
import TarjetaNoticia from "../components/noticias/TarjetaNoticia";

import dynamic from "next/dynamic";
import Footer from "../components/compartidos/Footer";
import ProductosDestacados from "../components/compartidos/ProductosDestacados";

const Map = dynamic(
  () => import("../components/compartidos/MapUbicacion"),
  { ssr: false }
);

export default function SuculentasPage() {
  return (
    <>
    <div className="bg-black">

        <AuthModal />
      <Navbar tema="suculentas" />
      <HeroSuculentas />
      <ProductosDestacados tienda="suculentas" />
      <ContenedorNoticias
        tienda="suculentas"/>
      <ProductosSuculentas />
      <NosotrosSuculentas />
      <Map tienda="suculentas" />
      <ContactoSuculentas />
      <Footer tienda="suculentas" />
    </div>
    </>
  );
}