import Image from "next/image";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlineMapPin,
} from "react-icons/hi2";

interface Props {
  tienda: "cocteleria" | "suculentas";
}

/* ─── Redes sociales: cambia los href por los reales ─── */
const REDES = [
  { nombre: "Instagram", href: "https://instagram.com/", Icono: FaInstagram },
  { nombre: "Facebook", href: "https://facebook.com/", Icono: FaFacebookF },
  { nombre: "Correo", href: "mailto:contacto@ejemplo.cl", Icono: MdOutlineEmail },
  { nombre: "WhatsApp", href: "https://wa.me/569XXXXXXXX", Icono: FaWhatsapp },
];

/* ─── Datos de contacto: reemplaza por los reales ─── */
const CONTACTO = [
  {
    etiqueta: "Celular",
    texto: "+56 9 XXXX XXXX",
    href: "tel:+569XXXXXXXX",
    Icono: HiOutlinePhone,
  },
  {
    etiqueta: "Email",
    texto: "contacto@ejemplo.cl",
    href: "mailto:contacto@ejemplo.cl",
    Icono: HiOutlineEnvelope,
  },
  {
    etiqueta: "Horario",
    texto: "Lun a Sáb · 10:00 a 19:00",
    href: undefined,
    Icono: HiOutlineClock,
  },
  {
    etiqueta: "Dirección",
    texto: "Calle Ejemplo 123, Penco",
    href: undefined,
    Icono: HiOutlineMapPin,
  },
];

/* ─── Colores por tienda (clases completas para que Tailwind las detecte) ─── */
const TEMAS = {
  cocteleria: {
    id:'1',
    fondo: "bg-pastel-brown",
    borde: "border-pastel-peach/20",
    texto: "text-pastel-peach",
    textoSuave: "text-pastel-peach/70",
    circulo:
      "bg-pastel-peach text-pastel-brown hover:bg-pastel-pink hover:text-white",
    icono: "text-pastel-pink",
    enlace: "hover:text-pastel-pink",
    corazon: "text-pastel-pink",
     imagen:'/logo1.PNG',
  },
  suculentas: {
    id:'2',
    fondo: "bg-terra-hover",
    borde: "border-cream/20",
    texto: "text-cream",
    textoSuave: "text-cream/70",
    circulo: "bg-cream text-terra hover:bg-terra-dark hover:text-cream",
    icono: "text-cream/80",
    enlace: "hover:text-white",
    corazon: "text-cream",
    imagen:'/logo1.PNG',
  },
} as const;

export default function Footer({ tienda }: Props) {
  const tema = TEMAS[tienda];

  return (
    <footer className={`relative w-full border-t ${tema.borde} ${tema.fondo}`}>
      {/* Contenedor principal: col en mobile, row en pantallas grandes */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-12 px-6 py-14 md:flex-row md:items-start md:gap-8 md:py-16">
        {/* ===== 1. Redes sociales ===== */}
        <div className="flex w-full flex-col items-center gap-5 md:w-1/3 md:items-start">
          <ul className="flex flex-wrap justify-center gap-4 md:justify-start">
            {REDES.map(({ nombre, href, Icono }) => (
              <li key={nombre}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nombre}
                  title={nombre}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${tema.circulo}`}
                >
                  <Icono />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== 2. Logo (centro) ===== */}
        <div className="flex w-full flex-col items-center gap-3 md:w-1/3">
          <a
            href="https://www.barriosweb.cl/en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar BABM"
            className="transition-transform duration-300 hover:scale-105"
          >
            <Image
              src={tema.imagen}
              alt={tema.id === '1' ? "Logo de Coctelería" : "Logo de Suculentas"}
              width={160}
              height={160}
              className="h-auto w-28 md:w-32"
            />
          </a>
          <p className={`text-center text-xs md:text-sm ${tema.textoSuave}`}>
            Desarrollada Y Mantenida Por BABM{" "}
            <span className={tema.corazon}>{"<3"}</span>
          </p>
        </div>

        {/* ===== 3. Información de contacto ===== */}
        <div className="flex w-full justify-center md:w-1/3 md:justify-end">
          <ul className={`flex flex-col gap-4 text-sm ${tema.texto}`}>
            {CONTACTO.map(({ etiqueta, texto, href, Icono }) => (
              <li key={etiqueta} className="flex items-start gap-3">
                <Icono className={`mt-0.5 shrink-0 text-lg ${tema.icono}`} />
                <div className="flex flex-col leading-tight">
                  <span
                    className={`text-[10px] font-semibold tracking-wider uppercase ${tema.textoSuave}`}
                  >
                    {etiqueta}
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className={`transition-colors ${tema.enlace}`}
                    >
                      {texto}
                    </a>
                  ) : (
                    <span>{texto}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}