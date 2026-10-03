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
  destacado?: boolean; // Nuevo campo para indicar si el producto es destacado
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
  destacad?: boolean;
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
  destacado?: boolean; // Nuevo campo para indicar si la noticia es destacada
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