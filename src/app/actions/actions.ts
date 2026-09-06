"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { Noticia,Producto } from "@/app/types/productos";


export async function obtenerNoticiasVisibles(): Promise<Noticia[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_noticias_visibles");
  if (error) throw new Error(error.message);
  return data;
}

export async function obtenerCoctelesVisibles(): Promise<Producto[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_cocteles_visibles");
  if (error) throw new Error(error.message);
  return data;
}

export async function obtenerSuculentasVisibles(): Promise<Producto[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_suculentas_visibles");
  if (error) throw new Error(error.message);
  return data;
}

// Obtiene el resumen de todas las compras de un usuario
export async function obtenerHistorialCompras(userId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.rpc("obtener_historial_compras_usuario", {
    p_usuario_id: userId,
  });

  if (error) {
    console.error("Error RPC historial:", error);
    return [];
  }

  return data;
}

// Obtiene el detalle completo de una venta específica
export async function obtenerDetalleVenta(ventaId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.rpc("obtener_detalle_venta", {
    p_venta_id: ventaId,
  });

  if (error) {
    console.error("Error RPC detalle:", error);
    return null;
  }

  // La RPC devuelve un array. Si no hay datos, es null.
  if (!data || data.length === 0) return null;

  // Retornamos un objeto con la cabecera (primer item) y los items (array completo)
  return {
    cabecera: data[0],
    items: data,
  };
}