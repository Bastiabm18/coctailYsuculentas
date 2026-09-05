"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiCheck, HiMapPin, HiTrash, HiGlobeAlt } from "react-icons/hi2";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Asegúrate de tener esta variable de entorno en tu .env.local
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Coords {
  lat: number;
  lng: number;
}

interface MapSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (coords: Coords | null) => void;
}

export default function MapSelectorModal({ isOpen, onClose, onSelect }: MapSelectorModalProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  // Estados
  const [tempCoords, setTempCoords] = useState<Coords | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Coordenada inicial (Santiago, Chile) por defecto
  const INITIAL_CENTER: Coords = { lat: -33.4489, lng: -70.6693 };

// Efecto para manejar la inicialización del mapa y el modal de permisos
  useEffect(() => {
    if (!isOpen) return;

    // Mostrar el mini modal de permisos al abrir
    setShowPermissionModal(true);

    // Inicializar mapa solo si no existe
    if (!map.current && mapContainer.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [INITIAL_CENTER.lng, INITIAL_CENTER.lat],
        zoom: 12,
      });

      // Manejar click en el mapa
      map.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        setTempCoords({ lat, lng });
        
        if (map.current) {
            // Mover o crear marcador
            if (marker.current) {
              marker.current.setLngLat([lng, lat]);
            } else {
              marker.current = new mapboxgl.Marker({ color: "#E57373" }) 
                .setLngLat([lng, lat])
                .addTo(map.current);
            }
        }
      });
      
      // Forzar un resize después de que la animación de apertura termine
      // Esto asegura que el mapa tenga el tamaño correcto y no salga gris
      setTimeout(() => {
          if (map.current) map.current.resize();
      }, 300);
    }

    // --- AQUÍ ESTÁ LA CORRECCIÓN ---
    return () => {
      // 1. Eliminar explícitamente el mapa para liberar memoria y el contexto WebGL
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      // 2. Limpiar referencias al marcador
      if (marker.current) {
        marker.current = null;
      }
      // 3. Resetear el modal de permisos
      setShowPermissionModal(false);
    };
    // -------------------------------
  }, [isOpen]);

  // Función para solicitar ubicación real
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      setShowPermissionModal(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userCoords: Coords = { lat: latitude, lng: longitude };
        
        // Mover el mapa a la ubicación del usuario
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true // asegura que la animación ocurra incluso si el usuario prefiere reducción de movimiento
          });
          
          // Opcional: Auto-seleccionar el punto donde está el usuario
          setTempCoords(userCoords);
          if (marker.current) {
            marker.current.setLngLat([longitude, latitude]);
          } else {
            marker.current = new mapboxgl.Marker({ color: "#E57373" })
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
        }
        setShowPermissionModal(false);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        alert("No se pudo obtener tu ubicación. Usaremos la vista por defecto.");
        setShowPermissionModal(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Función para usar ubicación por defecto (cancelar permiso)
  const handleUseDefaultLocation = () => {
    if (map.current) {
      map.current.flyTo({
        center: [INITIAL_CENTER.lng, INITIAL_CENTER.lat],
        zoom: 12
      });
    }
    setShowPermissionModal(false);
  };

  const handleSelect = () => {
    if (tempCoords) {
      onSelect(tempCoords);
      onClose();
    }
  };

  const handleClear = () => {
    setTempCoords(null);
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Principal */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Principal */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-[90vw] md:w-[70vw] h-[60vh] md:h-[70vh] flex flex-col overflow-hidden pointer-events-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white z-20">
                <div className="flex items-center gap-2">
                  <HiMapPin className="text-pastel-red text-xl" />
                  <h3 className="font-bold text-neutral-800 text-lg">Seleccionar ubicación</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
                >
                  <HiXMark className="text-xl" />
                </button>
              </div>

              {/* Contenedor del Mapa (Posición relativa para el mini modal) */}
              <div className="flex-1 w-full bg-neutral-200 relative">
                
                <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
                
                {/* --- MINI MODAL DE PERMISOS --- */}
                <AnimatePresence>
                  {showPermissionModal && (
                    <motion.div
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="bg-white p-6 rounded-xl shadow-xl max-w-xs w-full mx-4 text-center"
                        initial={{ y: 20, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 20, scale: 0.95 }}
                      >
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <HiGlobeAlt className="text-2xl" />
                        </div>
                        <h4 className="font-bold text-neutral-800 mb-2">¿Usar tu ubicación?</h4>
                        <p className="text-sm text-neutral-500 mb-6">
                          Necesitamos permiso para centrar el mapa en tu posición actual.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleUseDefaultLocation}
                            className="flex-1 py-2 px-4 rounded-lg border border-neutral-200 text-neutral-600 text-sm font-medium hover:bg-neutral-50 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleRequestLocation}
                            className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                          >
                            Permitir
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Instrucción flotante (solo si no está el modal de permisos) */}
                {!showPermissionModal && (
                   <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-xs font-medium text-neutral-600 pointer-events-none z-10 whitespace-nowrap">
                    Haz click en el mapa para fijar el punto
                  </div>
                )}
                
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-100 bg-white flex items-center justify-between z-20">
                <div className="text-sm text-neutral-500">
                  {tempCoords ? (
                    <span className="text-pastel-red font-medium flex items-center gap-1">
                      <HiCheck className="text-lg" /> Punto seleccionado
                    </span>
                  ) : (
                    "Sin selección"
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClear}
                    disabled={!tempCoords}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <HiTrash /> Limpiar
                  </button>
                  <button
                    onClick={handleSelect}
                    disabled={!tempCoords}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-pastel-red text-white text-sm font-bold shadow-lg shadow-pastel-red/20 hover:bg-pastel-red-hover hover:shadow-pastel-red/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                  >
                    Seleccionar
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}