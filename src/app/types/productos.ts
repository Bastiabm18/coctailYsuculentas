export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  tipo: string | null;
  precio: number;
  estado: boolean;
  fecha_creacion: string;
}

export interface ProductoForm {
  id?: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  tipo: string;
  precio: number;
  estado: boolean;
}