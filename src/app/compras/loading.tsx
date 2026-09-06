export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-red"></div>
        <p className="text-neutral-500 font-medium">Cargando historial...</p>
      </div>
    </div>
  );
}