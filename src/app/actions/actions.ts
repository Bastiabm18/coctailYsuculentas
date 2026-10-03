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


export async function obtenerSuculentaPorId(id: string): Promise<Producto | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .rpc("obtener_suculenta_por_id", { p_id: id })
    .maybeSingle();

  if (error) {
    console.error("obtenerSuculentaPorId:", error.message);
    return null;
  }
  return (data as Producto | null) ?? null;
}



export async function obtenerProductoPorId(id: string): Promise<Producto | null> {
   const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .rpc("obtener_coctel_por_id", { p_id: id })
    .maybeSingle();

  if (error) {
    console.error("obtenerProductoPorId:", error.message);
    return null;
  }
  return (data as Producto | null) ?? null;
}

export async function obtenerCoctelesDestacados(): Promise<Producto[]> {
    const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_cocteles_destacados");

  if (error) {
    console.error("obtenerCoctelesDestacados:", error.message);
    return [];
  }
  return (data ?? []) as Producto[];
}

export async function obtenerSuculentasDestacadas(): Promise<Producto[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_suculentas_destacadas");

  if (error) {
    console.error("obtenerSuculentasDestacadas:", error.message);
    return [];
  }
  return (data ?? []) as Producto[];
}

export async function obtenerTodasNoticiasVisibles(): Promise<Noticia[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_todas_noticias_visibles");

  if (error) {
    console.error("obtenerTodasNoticiasVisibles:", error.message);
    return [];
  }
  return (data ?? []) as Noticia[];
}

export async function obtenerNoticiaPorId(id: string): Promise<Noticia | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_noticia_por_id", {
    p_id: id,
  });

  if (error) {
    console.error("obtenerNoticiaPorId:", error.message);
    return null;
  }
  return ((data as Noticia[])?.[0] ?? null);
}