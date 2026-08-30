"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hook/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import SuculentasManager from "../components/SuculentasManager";

const EMAIL_PERMITIDO = "andresbarriosmedina1@gmail.com";

export default function SuculentasPage() {
  const router = useRouter();
  const { userData } = useAuth();

  useEffect(() => {
    if (userData && userData.email !== EMAIL_PERMITIDO) {
      router.push("/");
    }
  }, [userData, router]);

  if (!userData || userData.email !== EMAIL_PERMITIDO) return null;

  return (
    <DashboardLayout>
      <SuculentasManager />
    </DashboardLayout>
  );
}