"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tienda: "cocteleria" | "suculentas";
}

interface CartContextType {
  items: CartItem[];
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
  agregarItem: (item: Omit<CartItem, "cantidad">) => void;
  eliminarItem: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  limpiarCarrito: () => void;
  total: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [abierto, setAbierto] = useState(false);

  const agregarItem = useCallback((nuevo: Omit<CartItem, "cantidad">) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === nuevo.id);
      if (existente) {
        return prev.map((i) =>
          i.id === nuevo.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...nuevo, cantidad: 1 }];
    });
  }, []);

  const eliminarItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const actualizarCantidad = useCallback((id: string, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad } : i))
    );
  }, []);

  const limpiarCarrito = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        abierto,
        abrir: () => setAbierto(true),
        cerrar: () => setAbierto(false),
        agregarItem,
        eliminarItem,
        actualizarCantidad,
        limpiarCarrito,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}