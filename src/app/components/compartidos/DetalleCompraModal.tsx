"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiMapPin } from "react-icons/hi2";
import { obtenerDetalleVenta } from "@/app/actions/actions";
import UbicacionCompra from "./UbicacionCompra";



interface DetalleCompraModalProps {
  isOpen: boolean;
  onClose: () => void;
  ventaId: string | null;
}

export default function DetalleCompraModal({ isOpen, onClose, ventaId }: DetalleCompraModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  // Efecto para cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && ventaId) {
      setLoading(true);
      obtenerDetalleVenta(ventaId).then((result) => {
        setData(result);
        setLoading(false);
      });
    }
  }, [isOpen, ventaId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-white w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white shrink-0">
                <h2 className="font-bold text-lg text-neutral-800">Detalle de Compra</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
                >
                  <HiXMark className="text-xl" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastel-red"></div>
                  </div>
                ) : data ? (
                  <div className="space-y-6">
                    {/* Envío y Mapa */}
                    <div className="bg-neutral-50 rounded-xl p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <HiMapPin className="text-pastel-red mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-neutral-800">{data.cabecera.direccion}</p>
                          <p className="text-sm text-neutral-600">{data.cabecera.ciudad}, {data.cabecera.region}</p>
                          <p className="text-sm text-neutral-600">Tel: {data.cabecera.telefono}</p>
                        </div>
                      </div>
                      {data.cabecera.latitud && data.cabecera.longitud && (
                         <div className="relative w-full h-48 rounded-xl overflow-hidden border border-neutral-200">
                           <UbicacionCompra lat={data.cabecera.latitud} lng={data.cabecera.longitud} />
                         </div>
                      )}
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Productos</h3>
                      <div className="border border-neutral-100 rounded-xl overflow-hidden">
                        {data.items.map((item: any, idx: number) => (
                          <div key={idx} className={`flex justify-between items-center p-4 ${idx !== data.items.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-xs">
                                {item.item_tipo === 'cocteleria' ? '🍽' : '🌵'}
                              </div>
                              <div>
                                <p className="font-semibold text-neutral-800 text-sm">{item.item_nombre}</p>
                                <p className="text-xs text-neutral-400">{item.item_cantidad} x ${item.item_precio}</p>
                              </div>
                            </div>
                            <span className="font-bold text-neutral-800">${item.item_subtotal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-dashed border-neutral-200 flex justify-between items-end">
                      <span className="text-neutral-500 font-medium">Total Pagado</span>
                      <span className="text-2xl font-bold text-pastel-red">${data.cabecera.total}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-neutral-500 py-8">Error al cargar los detalles.</p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}