import ContactoCocteleria from "../components/cocteleria/ContactoCocteleria";
import HeroCocteleria from "../components/cocteleria/HeroCocteleria";
import NosotrosCocteleria from "../components/cocteleria/NosotrosCocteleria";
import ProductosCocteleria from "../components/cocteleria/ProductosCocteleria";
import AuthModal from "../components/compartidos/AuthModal";
import Navbar from "../components/compartidos/navbar";


export default function cocteleriaPage() {
  return (
    <>
      <AuthModal />
      <Navbar tema="cocteleria" />
      <HeroCocteleria />
      <ProductosCocteleria />
      <NosotrosCocteleria />
      <ContactoCocteleria />
    </>
  );
}