"use client"
import ContactoCocteleria from "../components/cocteleria/ContactoCocteleria";
import HeroCocteleria from "../components/cocteleria/HeroCocteleria";
import NosotrosCocteleria from "../components/cocteleria/NosotrosCocteleria";
import ProductosCocteleria from "../components/cocteleria/ProductosCocteleria";
import AuthModal from "../components/compartidos/AuthModal";
import Footer from "../components/compartidos/Footer";
import Navbar from "../components/compartidos/navbar";
import ProductosDestacados from "../components/compartidos/ProductosDestacados";
import ContenedorNoticias from "../components/noticias/ContenedorTarjetas";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("../components/compartidos/MapUbicacion"),
  { ssr: false }
);


export default function cocteleriaPage() {
  return (
    <>
      <AuthModal />
      <Navbar tema="cocteleria" />
      <HeroCocteleria />
      <ContenedorNoticias
        tienda="cocteleria"
      />
     <ProductosDestacados tienda="cocteleria" />
      <ProductosCocteleria />
      <NosotrosCocteleria />
         <Map tienda="cocteleria" />
      <ContactoCocteleria />
      <Footer tienda="cocteleria" />
    </>
  );
}