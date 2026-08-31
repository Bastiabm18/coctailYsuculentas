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