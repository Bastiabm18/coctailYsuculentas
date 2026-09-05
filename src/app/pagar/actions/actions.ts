"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { CartItem } from "@/context/CartContext"; 
import { EnvioData } from "@/app/types/productos";



export async function procesarCompra(
  userId: string, 
  cartItems: CartItem[], 
  envio: EnvioData, 
  total: number
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    // CORRECCIÓN AQUÍ: Quitamos JSON.stringify. Enviamos los objetos directos.
    const { data, error } = await supabase.rpc("crear_venta", {
      p_usuario_id: userId,
      p_items: cartItems,      
      p_envio: envio,            
      p_total: total
    });

    if (error) throw error;

    return { success: true, ventaId: data };
  } catch (error) {
    console.error("Error procesando compra:", error);
    return { success: false, error: "No se pudo procesar la compra" };
  }
}