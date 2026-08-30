import AuthModal from "../components/compartidos/AuthModal";
import Navbar from "../components/compartidos/navbar";
import ContactoSuculentas from "../components/suculentas/ContactoSuculentas";
import HeroSuculentas from "../components/suculentas/HeroSuculentas";
import NosotrosSuculentas from "../components/suculentas/NosotrosSuculentas";
import ProductosSuculentas from "../components/suculentas/ProductosSuculentas";
import ContenedorNoticias from "../components/noticias/ContenedorTarjetas";
import TarjetaNoticia from "../components/noticias/TarjetaNoticia";

export default function SuculentasPage() {
  return (
    <>
    <div className="bg-black">

        <AuthModal />
      <Navbar tema="suculentas" />
      <HeroSuculentas />
      <ContenedorNoticias
        tienda="suculentas"/>
      <ProductosSuculentas />
      <NosotrosSuculentas />
      <ContactoSuculentas />
    </div>
    </>
  );
}