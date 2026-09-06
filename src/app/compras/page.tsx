import { Suspense } from "react";
import ComprasClient from "./ComprasClient";

export default function ComprasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-pastel-red">Cargando historial...</div>}>
      <ComprasClient />
    </Suspense>
  );
}