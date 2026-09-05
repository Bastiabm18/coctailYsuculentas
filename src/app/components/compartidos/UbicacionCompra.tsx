"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface UbicacionCompraProps {
  lat: number;
  lng: number;
}

export default function UbicacionCompra({ lat, lng }: UbicacionCompraProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Asegúrate de tener el token configurado
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    // Evitamos reinicializar el mapa si ya existe
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 15,
      interactive: false, // Desactiva arrastrar/zoom para que sea solo visual
      attributionControl: false // Opcional: quitar atributos de Mapbox para limpiar el look en el recibo
    });

    // Agregamos un marcador verde para indicar el lugar de entrega
    new mapboxgl.Marker({ color: "#16a34a" }) // Verde éxito
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Limpieza
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-48 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-inner"
    />
  );
}