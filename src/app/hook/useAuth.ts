"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const supabase = createClient();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ id: string; nombre: string; email: string; avatar: string | null } | null>(null);

  useEffect(() => {
    const cargar = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const meta = session.user.user_metadata;
        const av = meta?.avatar_url || meta?.picture || null;
        setAvatar(av);
        setUserData({
          id: session.user.id,
          nombre: meta?.nombre_completo || meta?.full_name || meta?.name || "",
          email: session.user.email || "",
          avatar: av,
        });
      }
    };

    cargar();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        const av = meta?.avatar_url || meta?.picture || null;
        setAvatar(av);
        setUserData({
          id: session.user.id,
          nombre: meta?.nombre_completo || meta?.full_name || meta?.name || "",
          email: session.user.email || "",
          avatar: av,
        });
      } else {
        setAvatar(null);
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return { avatar, userData, cerrarSesion };
}