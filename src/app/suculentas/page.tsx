import AuthModal from "../components/compartidos/AuthModal";
import Navbar from "../components/compartidos/navbar";
import ContactoSuculentas from "../components/suculentas/ContactoSuculentas";
import HeroSuculentas from "../components/suculentas/HeroSuculentas";
import NosotrosSuculentas from "../components/suculentas/NosotrosSuculentas";
import ProductosSuculentas from "../components/suculentas/ProductosSuculentas";

export default function SuculentasPage() {
  return (
    <>
        <AuthModal />
      <Navbar tema="suculentas" />
      <HeroSuculentas />
      <ProductosSuculentas />
      <NosotrosSuculentas />
      <ContactoSuculentas />
    </>
  );
}