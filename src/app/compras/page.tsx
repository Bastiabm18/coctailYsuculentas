"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HiCheckCircle, HiArrowLeft, HiMapPin, HiReceiptRefund } from "react-icons/hi2";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import UbicacionCompra from "../components/compartidos/UbicacionCompra";

export const dynamic = 'force-dynamic';

export default function CompraExitosaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ventaId = searchParams.get("id");
  console.log("ventaId:", ventaId);
  
  const [loading, setLoading] = useState(true);
  const [venta, setVenta] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!ventaId) {
      router.push("/");
      return;
    }

    const fetchVenta = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("obtener_detalle_venta", {
        p_venta_id: ventaId,
      });

      console.log("RPC obtener_detalle_venta data:", data);

      if (error) {
        console.error("Error cargando venta:", error);
        setLoading(false);
        return;
      }

      // La RPC devuelve filas repetidas por cada item.
      // La primera fila tiene los datos de la cabecera.
      if (data && data.length > 0) {
        setVenta(data[0]); // Cabecera
        setItems(data);    // Todos los items
      }
      setLoading(false);
    };

    fetchVenta();
  }, [ventaId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-red"></div>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Orden no encontrada</h2>
          <button onClick={() => router.push("/")} className="text-pastel-red">Ir al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Tarjeta Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-100"
        >
          {/* Header Success */}
          <div className="bg-green-50 p-8 text-center border-b border-green-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <HiCheckCircle className="text-4xl text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-green-800">¡Compra Exitosa!</h1>
            <p className="text-green-600 mt-2">Tu orden ha sido procesada correctamente.</p>
            <p className="text-xs text-green-500 font-mono mt-1"># {ventaId}</p>
          </div>

          {/* Contenido */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Datos de Envío */}
            <div>
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Detalle de Envío</h3>
              <div className="bg-neutral-50 rounded-xl p-4 flex gap-4">
                <div className="text-pastel-red mt-1">
                  <HiMapPin className="text-xl" />
                </div>
                <div>
                  <p className="font-bold text-neutral-800">{venta.direccion}</p>
                  <p className="text-sm text-neutral-600">{venta.ciudad}, {venta.region}</p>
                  <p className="text-sm text-neutral-600">Tel: {venta.telefono}</p>
                </div>

                 {/* --- COMPONENTE DEL MAPA --- */}
                {/* Solo renderizamos si tenemos coordenadas válidas */}
                {venta.latitud && venta.longitud && (
                  <div className="relative w-full">
                     {/* Pequeño título sobre el mapa */}
                    <p className="text-xs font-semibold text-neutral-400 mb-2 uppercase">Ubicación de Entrega</p>
                    <UbicacionCompra 
                      lat={venta.latitud} 
                      lng={venta.longitud} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Productos */}
            <div>
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Productos Comprados</h3>
              <div className="border border-neutral-100 rounded-xl overflow-hidden">
                {items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center p-4 ${index !== items.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-xs">
                        {item.item_tipo === 'cocteleria' ? '🍽' : '🌵'}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800 text-sm">{item.item_nombre}</p>
                        <p className="text-xs text-neutral-400">{item.item_cantidad} x ${item.item_precio}</p>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-800">
                      ${item.item_subtotal}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-dashed border-neutral-200">
              <div className="flex justify-between items-end">
                <span className="text-neutral-500 font-medium">Total Pagado</span>
                <span className="text-2xl font-bold text-pastel-red">
                  ${venta.total}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 bg-neutral-800 text-white rounded-xl font-bold hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
            >
              <HiArrowLeft /> Volver al Inicio
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}