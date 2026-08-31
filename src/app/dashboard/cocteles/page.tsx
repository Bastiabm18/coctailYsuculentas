"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hook/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import SuculentasManager from "../components/SuculentasManager";
import CoctelesManager from "../components/CoctelesManager";

// 1. Convertimos la variable de entorno en un array separando por comas
const ADMINS_PERMITIDOS = (process.env.NEXT_PUBLIC_ADMIN_CORREO || "")
  .split(",")
  .map((email) => email.trim());

export default function DashboardPage() {
  const router = useRouter();
  const { userData } = useAuth();

  // 2. Verificamos si el email del usuario está incluído en el array
  const esAdmin = userData?.email ? ADMINS_PERMITIDOS.includes(userData.email) : false;

  useEffect(() => {
    if (userData && !esAdmin) {
      router.push("/");
    }
  }, [userData, esAdmin, router]);

  if (!userData || !esAdmin) return null;
  

  return (
    <DashboardLayout>
      <CoctelesManager />
    </DashboardLayout>
  );
}