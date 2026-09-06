"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hook/useAuth";
import { HiOutlineClipboardDocumentList, HiMapPin, HiChevronRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import { obtenerHistorialCompras } from "../actions/actions";
import DetalleCompraModal from "../components/compartidos/DetalleCompraModal";
import { BiArrowBack } from "react-icons/bi";
import { router } from "next/client";
import {useRouter} from "next/navigation";

interface CompraResumen {
  id: string;
  fecha_creacion: string;
  total: number;
  estado: string;
  ciudad: string;
  region: string;
  cantidad_items: number;
}

export default function ComprasPage() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState<CompraResumen[]>([]);
  
  // Estado para controlar el modal
  const [selectedVentaId, setSelectedVentaId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userData?.id) return;

    const fetchCompras = async () => {
      const data = await obtenerHistorialCompras(userData.id);
      setCompras(data);
      setLoading(false);
    };

    fetchCompras();
  }, [userData]);

  const handleOpenDetalle = (id: string) => {
    setSelectedVentaId(id);
  };

  const handleCloseDetalle = () => {
    setSelectedVentaId(null);
  };

  if (loading) return <div className="p-8 text-center">Cargando historial...</div>;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div 
        onClick={ ()=> router.back() }
        className="flex items-center gap-4 mb-4">
            <BiArrowBack className="text-2xl text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer mb-4" />
        </div>
        
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-pastel-red/10 rounded-full flex items-center justify-center text-pastel-red text-2xl font-bold">
            {userData?.nombre?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Mis Compras</h1>
            <p className="text-neutral-500">
              Historial de pedidos para <span className="font-medium text-neutral-700">{userData?.email}</span>
            </p>
          </div>
        </div>

        {/* Lista */}
        {compras.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-neutral-200">
            <HiOutlineClipboardDocumentList className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">Aún no tienes compras registradas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {compras.map((compra) => (
              <motion.div
                key={compra.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md hover:border-neutral-200 transition-all cursor-pointer group"
                onClick={() => handleOpenDetalle(compra.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        {new Date(compra.fecha_creacion).toLocaleDateString("es-CL")}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-xs text-neutral-400">
                        {compra.cantidad_items} {compra.cantidad_items === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <HiMapPin className="text-sm text-terra" />
                      <span className="text-sm font-medium">{compra.ciudad}, {compra.region}</span>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      compra.estado === 'pendiente' 
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                        : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {compra.estado}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-neutral-400 uppercase font-bold">Total</p>
                      <p className="text-lg font-bold text-neutral-800">${compra.total.toLocaleString("es-CL")}</p>
                    </div>
                    <HiChevronRight className="text-neutral-300 group-hover:text-pastel-red transition-colors text-xl" />
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Separado */}
      <DetalleCompraModal 
        isOpen={!!selectedVentaId} 
        ventaId={selectedVentaId} 
        onClose={handleCloseDetalle} 
      />

    </div>
  );
}