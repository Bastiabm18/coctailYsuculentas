"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Producto, ProductoForm } from "@/app/types/productos";

export async function subirImagen(formData: FormData): Promise<string> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const archivo = formData.get("archivo") as File;
  if (!archivo) throw new Error("No hay archivo");

  if (archivo.size > 5 * 1024 * 1024) throw new Error("Máximo 5MB por imagen");

  const ext = archivo.name.split(".").pop();
  const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("productos").upload(nombre, archivo);
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("productos").getPublicUrl(nombre);
  return data.publicUrl;
}

export async function eliminarImagen(url: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const ruta = url.split("/productos/")[1];
  if (!ruta) return;

  await supabase.storage.from("productos").remove([ruta]);
}

// ─── COCTELES ───

export async function obtenerCocteles(): Promise<Producto[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_cocteles");
  if (error) throw new Error(error.message);
  return data;
}

export async function insertarCoctel(form: ProductoForm) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.rpc("insertar_coctel", {
    p_nombre: form.nombre,
    p_descripcion: form.descripcion || null,
    p_imagen_url: form.imagen_url || null,
    p_tipo: form.tipo || null,
    p_precio: form.precio,
    p_estado: form.estado,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/cocteles");
}

export async function editarCoctel(form: ProductoForm) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.rpc("editar_coctel", {
    p_id: form.id,
    p_nombre: form.nombre,
    p_descripcion: form.descripcion || null,
    p_imagen_url: form.imagen_url || null,
    p_tipo: form.tipo || null,
    p_precio: form.precio,
    p_estado: form.estado,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/cocteles");
}

export async function eliminarCoctel(id: string, imagenUrl?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (imagenUrl) await eliminarImagen(imagenUrl);

  const { error } = await supabase.rpc("eliminar_coctel", { p_id: id });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/cocteles");
}

// ─── SUCULENTAS ───

export async function obtenerSuculentas(): Promise<Producto[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("obtener_suculentas");
  if (error) throw new Error(error.message);
  return data;
}

export async function insertarSuculenta(form: ProductoForm) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.rpc("insertar_suculenta", {
    p_nombre: form.nombre,
    p_descripcion: form.descripcion || null,
    p_imagen_url: form.imagen_url || null,
    p_tipo: form.tipo || null,
    p_precio: form.precio,
    p_estado: form.estado,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/suculentas");
}

export async function editarSuculenta(form: ProductoForm) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.rpc("editar_suculenta", {
    p_id: form.id,
    p_nombre: form.nombre,
    p_descripcion: form.descripcion || null,
    p_imagen_url: form.imagen_url || null,
    p_tipo: form.tipo || null,
    p_precio: form.precio,
    p_estado: form.estado,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/suculentas");
}

export async function eliminarSuculenta(id: string, imagenUrl?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (imagenUrl) await eliminarImagen(imagenUrl);

  const { error } = await supabase.rpc("eliminar_suculenta", { p_id: id });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/suculentas");
}