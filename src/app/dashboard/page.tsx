"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hook/useAuth";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./components/DashboardHome";


const EMAIL_PERMITIDO = "andresbarriosmedina1@gmail.com";

export default function DashboardPage() {
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
      <DashboardHome />
    </DashboardLayout>
  );
}