"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hook/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import VentasManager from "../components/VentasManager";

const ADMINS_PERMITIDOS = (process.env.NEXT_PUBLIC_ADMIN_CORREO || "")
  .split(",")
  .map((email) => email.trim());

export default function VentasPage() {
  const router = useRouter();
  const { userData } = useAuth();

  const esAdmin = userData?.email ? ADMINS_PERMITIDOS.includes(userData.email) : false;

  useEffect(() => {
    if (userData && !esAdmin) {
      router.push("/");
    }
  }, [userData, esAdmin, router]);

  if (!userData || !esAdmin) return null;

  return (
    <DashboardLayout>
      <VentasManager />
    </DashboardLayout>
  );
}