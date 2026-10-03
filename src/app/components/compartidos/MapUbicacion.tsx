'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { FaInstagram, FaTiktok, FaWhatsapp, FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGmail } from 'react-icons/si';

const resolveUrl = (img: any) => (typeof img === 'string' ? img : img.src);

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: resolveUrl(iconRetinaUrl),
  iconUrl: resolveUrl(iconUrl),
  shadowUrl: resolveUrl(shadowUrl),
});

// Coordenadas de Penco, Chile
const POSICION_PENCO: [number, number] = [-36.7167, -72.9942];

type Tienda = 'cocteleria' | 'suculentas';

interface MapProps {
  tienda: Tienda;
  position?: [number, number];
  titulo?: string;
}

/* ─── Redes sociales: cambia los href por los reales ─── */
const REDES = [
  { nombre: 'Instagram', href: 'https://instagram.com/', Icono: FaInstagram },
  { nombre: 'TikTok', href: 'https://tiktok.com/', Icono: FaTiktok },
  { nombre: 'WhatsApp', href: 'https://wa.me/569XXXXXXXX', Icono: FaWhatsapp },
  { nombre: 'Facebook', href: 'https://facebook.com/', Icono: FaFacebookF },
  { nombre: 'Correo', href: 'mailto:contacto@ejemplo.cl', Icono: SiGmail },
  { nombre: 'X', href: 'https://x.com/', Icono: FaXTwitter },
];

/* ─── Colores por tienda (clases completas para que Tailwind las detecte) ─── */
const TEMAS: Record<
  Tienda,
  { fondo: string; titulo: string; borde: string; circulo: string }
> = {
  cocteleria: {
    fondo: 'bg-pastel-peach',
    titulo: 'text-pastel-brown',
    borde: 'border-pastel-brown/20',
    circulo:
      'bg-pastel-red text-white hover:bg-pastel-brown hover:shadow-lg hover:shadow-pastel-brown/30',
  },
  suculentas: {
    fondo: 'bg-terra',
    titulo: 'text-cream',
    borde: 'border-cream/20',
    circulo:
      'bg-cream text-terra hover:bg-terra-dark hover:text-cream hover:shadow-lg hover:shadow-black/30',
  },
};

export default function Map({
  tienda,
  position = POSICION_PENCO,
  titulo = 'Encuéntranos',
}: MapProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  const mapboxAttribution =
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  const mapStyleId = 'mapbox/navigation-night-v1';
  const tileUrl = `https://api.mapbox.com/styles/v1/${mapStyleId}/tiles/{z}/{x}/{y}?access_token=${accessToken}`;

  const tema = TEMAS[tienda];

  return (
    // Sección a todo el ancho con el color de la tienda (sin franjas negras).
    // isolate + z-0 encierra los z-index internos de Leaflet para que no tape navbar/modales.
    <section
      className={`relative isolate z-0 w-full px-4 py-16 md:px-8 md:py-24 ${tema.fondo}`}
    >
      <h2
        className={`mb-10 text-center text-3xl font-bold tracking-tight md:mb-14 md:text-5xl ${tema.titulo}`}
      >
        {titulo}
      </h2>

      {/* Mobile: columna · Desktop: fila, ambos bloques del mismo tamaño */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-evenly gap-10 md:flex-row md:gap-6">
        {/* Redes */}
        <div className="flex w-full items-center justify-center md:w-[45%]">
          <ul className="grid grid-cols-3 gap-5 md:gap-6">
            {REDES.map(({ nombre, href, Icono }) => (
              <li key={nombre}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nombre}
                  title={nombre}
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current md:h-20 md:w-20 md:text-3xl ${tema.circulo}`}
                >
                  <Icono />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mapa */}
        <div
          className={`relative h-[50vh] w-full overflow-hidden rounded-2xl border md:h-[55vh] md:w-[45%] ${tema.borde}`}
        >
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            className="absolute inset-0 h-full w-full"
          >
            <TileLayer
              key={mapStyleId}
              attribution={mapboxAttribution}
              url={tileUrl}
              tileSize={512}
              zoomOffset={-1}
            />
            <Marker position={position}>
              <Popup>
                <div className="flex flex-col gap-0.5 py-1">
                  <span className="text-sm font-bold">Penco</span>
                  <span className="text-xs opacity-80">Aquí estamos. ¡Te esperamos!</span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
}