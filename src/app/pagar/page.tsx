"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { HiUser, HiMapPin, HiPhone, HiCheckBadge, HiArrowLeft, HiCreditCard, HiMap as HiMapIcon, HiShoppingBag } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

import { useAuth } from "../hook/useAuth";
import MapSelectorModal from "../components/compartidos/MapSelectorModal";
import { procesarCompra } from "./actions/actions";


export default function PagarPage() {
  const router = useRouter();
  const { items, total, totalItems, limpiarCarrito } = useCart();
  const { userData } = useAuth();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Estado del formulario de envío
  const [formData, setFormData] = useState({
    direccion: "",
    ciudad: "",
    region: "",
    telefono: "",
    latitud: coords ? coords.lat : null,
    longitud: coords ? coords.lng : null,

  });
  
  // Nuevo estado para coordenadas y visibilidad del mapa
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiShoppingBag className="text-3xl text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Tu carrito está vacío</h2>
          <p className="text-neutral-500 mb-6">No hay productos para procesar en el pago.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-pastel-red text-white rounded-xl font-semibold hover:bg-pastel-red-hover transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!coords) {
      alert("Por favor selecciona una ubicación en el mapa.");
      return;
    }

    if (!userData) {
      alert("Debes estar logueado para comprar.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Preparamos el objeto de envío combinando formulario + mapa
      const datosEnvio = {
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        region: formData.region,
        telefono: formData.telefono,
        lat: coords.lat,
        lng: coords.lng,
      };

      // 2. Llamamos al Server Action
      const resultado = await procesarCompra(
        userData.id, // OJO: Aquí debes usar el ID real del user de Supabase
        items,
        datosEnvio,
        total
      );

    

      if (resultado.success) {
        // 3. Si todo sale bien, limpiamos y redirigimos
        limpiarCarrito();
        router.push(`/compras?id=${resultado.ventaId}`);
      } else {
        alert("Hubo un error: " + resultado.error);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error inesperado.");
      setIsProcessing(false);
    }
  };


    // Función que recibe las coordenadas del modal
  const handleMapSelect = (newCoords: { lat: number; lng: number } | null) => {
    setCoords(newCoords);
  };
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Móvil / Breadcrumbs simples */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm text-neutral-500 hover:text-pastel-red transition-colors"
        >
          <HiArrowLeft className="mr-2 text-lg" />
          Volver
        </button>

        <h1 className="text-3xl font-bold text-neutral-800 mb-8 tracking-tight">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: Formulario de Envío (8/12) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Datos del Perfil (Solo lectura) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pastel-red/10 rounded-lg text-pastel-red">
                  <HiUser className="text-xl" />
                </div>
                <h3 className="font-bold text-neutral-800">Datos del Comprador</h3>
              </div>
              
              {userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Nombre</label>
                    <div className="p-3 bg-neutral-50 rounded-xl text-neutral-700 font-medium">
                      {userData.nombre || "Usuario"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Email</label>
                    <div className="p-3 bg-neutral-50 rounded-xl text-neutral-700 font-medium">
                      {userData.email}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl text-sm flex items-center gap-2">
                  <HiCheckBadge className="text-lg" />
                  Debes iniciar sesión para continuar.
                </div>
              )}
            </div>

            {/* Formulario de Envío */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terra/10 rounded-lg text-terra">
                  <HiMapPin className="text-xl" />
                </div>
                <h3 className="font-bold text-neutral-800">Información de Envío</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-neutral-700 mb-1.5">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    required
                    placeholder="Ej: Av. Providencia 1234, Depto 402"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-pastel-red focus:ring-2 focus:ring-pastel-red/20 outline-none transition-all placeholder:text-neutral-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-medium text-neutral-700 mb-1.5">Ciudad / Comuna</label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      required
                      placeholder="Ej: Santiago"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-pastel-red focus:ring-2 focus:ring-pastel-red/20 outline-none transition-all placeholder:text-neutral-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-neutral-700 mb-1.5">Región</label>
                    <select
                      id="region"
                      name="region"
                      required
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-pastel-red focus:ring-2 focus:ring-pastel-red/20 outline-none transition-all text-neutral-700 bg-white"
                    >
                      <option value="">Selecciona una región</option>
                      <option value="metropolitana">Región Metropolitana</option>
                      <option value="valparaiso">Valparaíso</option>
                      <option value="biobio">Biobío</option>
                      {/* Agrega más regiones si es necesario */}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-neutral-700 mb-1.5">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <HiPhone />
                    </div>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      required
                      placeholder="+56 9 1234 5678"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-pastel-red focus:ring-2 focus:ring-pastel-red/20 outline-none transition-all placeholder:text-neutral-300"
                    />
                  </div>
                </div>

                    {/* --- NUEVO BOTÓN DE MAPA --- */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-terra/30 rounded-xl text-terra font-semibold hover:bg-terra/5 hover:border-terra transition-all group"
                  >
                    <HiMapIcon className="text-lg group-hover:scale-110 transition-transform" />
                    {coords ? "Editar ubicación GPS" : "Seleccionar ubicación en el mapa"}
                  </button>
                  
                  {coords && (
                    <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1 bg-green-50 text-green-700 p-2 rounded-lg border border-green-100">
                      <span className="font-bold">Ubicación GPS seleccionada:</span> 
                      Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* COLUMNA DERECHA: Resumen (4/12) */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              
              {/* Resumen Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg shadow-neutral-200/50 border border-neutral-100">
                <h3 className="font-bold text-lg text-neutral-800 mb-4 flex items-center gap-2">
                  <HiCreditCard className="text-pastel-red" />
                  Resumen ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
                </h3>

                {/* Lista de productos compacta */}
                <ul className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 items-center">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm ${
                          item.tienda === "cocteleria"
                            ? "bg-pastel-peach text-pastel-red"
                            : "bg-terra/10 text-terra"
                        }`}
                      >
                        {item.tienda === "cocteleria" ? "🍽" : "🌵"}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-neutral-800 truncate">
                          {item.nombre}
                        </h4>
                        <p className="text-xs text-neutral-400">
                          {item.cantidad} x ${item.precio.toLocaleString("es-CL")}
                        </p>
                      </div>
                      
                      <span className="text-sm font-bold text-neutral-700">
                        ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-dashed border-neutral-200 my-4"></div>

                {/* Totales */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString("es-CL")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-neutral-800 pt-2">
                    <span>Total</span>
                    <span>${total.toLocaleString("es-CL")}</span>
                  </div>
                </div>

                {/* Botón de Pago */}
                <button
                  type="button" // Cambiar a type="submit" si el form envuelve todo
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                    ${isProcessing 
                      ? 'bg-neutral-300 cursor-not-allowed' 
                      : 'bg-pastel-red hover:bg-pastel-red-hover hover:shadow-xl hover:shadow-pastel-red/30'
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        ⏳
                      </motion.span>
                      Procesando...
                    </>
                  ) : (
                    <>Pagar Ahora</>
                  )}
                </button>

                <p className="text-center text-xs text-neutral-400 mt-4">
                  🔒 Tus datos están protegidos. Pagos seguros con encriptación SSL.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
       {/* --- MODAL DEL MAPA --- */}
      <MapSelectorModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onSelect={handleMapSelect} 
      />

    </div>
  );
}