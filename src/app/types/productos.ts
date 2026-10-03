export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  tipo: string | null;
  precio: number;
  estado: boolean;
  fecha_creacion: string;
  cuidados?: string[]; // Cambiado de string a string[]
}

export interface ProductoForm {
  id?: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  tipo: string;
  precio: number;
  estado: boolean;
  cuidados?:string[];
}

export interface Noticia {
  id: string;
  titulo: string;
  subtitulo: string | null;
  contenido: string | null;
  imagen_url: string | null;
  estado: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface NoticiaForm {
  id?: string;
  titulo: string;
  subtitulo: string;
  contenido: string;
  imagen_url: string;
  estado: boolean;
}

export interface EnvioData {
  direccion: string;
  ciudad: string;
  region: string;
  telefono: string;
  lat: number;
  lng: number;
}