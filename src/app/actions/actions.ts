"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { Noticia } from "@/app/types/productos";

export async function obtenerNoticiasVisibles(): Promise<Noticia[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_noticias_visibles");
  if (error) throw new Error(error.message);
  return data;
}