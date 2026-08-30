import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CarroComponent from "./components/compartidos/carroComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coctelysuculentas — Cocteles & Suculentas",
  description: "Dos mundos, un solo lugar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
         <CartProvider>
           <CarroComponent />
          {children}
          </CartProvider>
        </body>
    </html>
  );
}