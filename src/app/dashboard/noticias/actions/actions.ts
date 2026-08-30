"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Noticia, NoticiaForm } from "@/app/types/productos";

export async function subirImagen(formData: FormData): Promise<string> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const archivo = formData.get("archivo") as File;
  if (!archivo) throw new Error("No hay archivo");

  if (archivo.size > 5 * 1024 * 1024) throw new Error("Máximo 5MB por imagen");

  const ext = archivo.name.split(".").pop();
  const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("noticias").upload(nombre, archivo);
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("noticias").getPublicUrl(nombre);
  return data.publicUrl;
}

export async function eliminarImagen(url: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const ruta = url.split("/noticias/")[1];
  if (!ruta) return;

  await supabase.storage.from("noticias").remove([ruta]);
}

export async function obtenerNoticias(): Promise<Noticia[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_noticias");
  if (error) throw new Error(error.message);
  return data;
}

export async function insertarNoticia(form: NoticiaForm) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.rpc("insertar_noticia", {
    p_titulo: form.titulo,
    p_subtitulo: form.subtitulo || null,
    p_contenido: form.contenido || null,
    p_imagen_url: form.imagen_url || null,
    p_estado: form.estado,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/noticias");
}

export async function editarNoticia(form: NoticiaForm) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.rpc("editar_noticia", {
    p_id: form.id,
    p_titulo: form.titulo,
    p_subtitulo: form.subtitulo || null,
    p_contenido: form.contenido || null,
    p_imagen_url: form.imagen_url || null,
    p_estado: form.estado,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/noticias");
}

export async function eliminarNoticia(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.rpc("eliminar_noticia", { p_id: id });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/noticias");
}