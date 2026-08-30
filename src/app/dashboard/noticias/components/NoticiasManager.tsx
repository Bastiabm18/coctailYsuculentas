"use client";

import { useState, useEffect } from "react";
import { HiPencil, HiTrash, HiEye, HiEyeSlash, HiArrowUpTray } from "react-icons/hi2";
import type { Noticia, NoticiaForm } from "@/app/types/productos";
import { editarNoticia, eliminarNoticia, insertarNoticia, obtenerNoticias, subirImagen } from "@/app/dashboard/noticias/actions/actions";

const formVacio: NoticiaForm = {
  titulo: "",
  subtitulo: "",
  contenido: "",
  imagen_url: "",
  estado: true,
};

export default function NoticiasManager() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<Noticia | null>(null);
  const [form, setForm] = useState<NoticiaForm>(formVacio);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await obtenerNoticias();
      setNoticias(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5MB");
      return;
    }

    setArchivo(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      let imagenUrl = form.imagen_url;

      if (archivo) {
        const formData = new FormData();
        formData.append("archivo", archivo);
        imagenUrl = await subirImagen(formData);
      }

      if (editando) {
        await editarNoticia({ ...form, imagen_url: imagenUrl });
      } else {
        await insertarNoticia({ ...form, imagen_url: imagenUrl });
      }

      setForm(formVacio);
      setEditando(null);
      setArchivo(null);
      setPreview(null);
      await cargar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleEditar = (n: Noticia) => {
    setEditando(n);
    setForm({
      id: n.id,
      titulo: n.titulo,
      subtitulo: n.subtitulo || "",
      contenido: n.contenido || "",
      imagen_url: n.imagen_url || "",
      estado: n.estado,
    });
    setArchivo(null);
    setPreview(n.imagen_url || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta noticia?")) return;
    setError(null);
    try {
      await eliminarNoticia(id);
      await cargar();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const cancelar = () => {
    setForm(formVacio);
    setEditando(null);
    setArchivo(null);
    setPreview(null);
    setError(null);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Noticias</h1>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-medium hover:underline">Cerrar</button>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-8 rounded-2xl bg-white border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-neutral-800">
            {editando ? "Editar noticia" : "Nueva noticia"}
          </h2>
          {editando && (
            <button type="button" onClick={cancelar} className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
              Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Título</label>
            <input
              type="text"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-neutral-400 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Subtítulo</label>
            <input
              type="text"
              value={form.subtitulo}
              onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-neutral-400 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Contenido</label>
            <textarea
              value={form.contenido}
              onChange={(e) => setForm({ ...form, contenido: e.target.value })}
              rows={6}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-neutral-400 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Imagen (máx. 5MB)</label>
            <label className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-500 cursor-pointer hover:border-neutral-400 hover:bg-neutral-100/50 transition-colors">
              <HiArrowUpTray className="text-lg" />
              {archivo ? archivo.name : "Seleccionar imagen"}
              <input type="file" accept="image/*" onChange={handleArchivo} className="hidden" />
            </label>
          </div>

          {preview && (
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-2 block">Vista previa</label>
              <div className="h-32 w-full max-w-xs overflow-hidden rounded-xl bg-neutral-100">
                <img src={preview} alt="preview" className="h-full w-full object-cover" />
              </div>
            </div>
          )}

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, estado: !form.estado })}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                form.estado ? "bg-green-100 text-green-600" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {form.estado ? <HiEye className="text-lg" /> : <HiEyeSlash className="text-lg" />}
            </button>
            <span className="text-sm text-neutral-500">
              {form.estado ? "Visible" : "Oculto"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={enviando}
            className="rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {enviando ? "Guardando..." : editando ? "Actualizar" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={cancelar}
            className="rounded-xl border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Tabla */}
      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-neutral-400">Cargando...</p>
        </div>
      ) : noticias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-neutral-400 text-sm">No hay noticias aún</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Acciones</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Imagen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Fecha creación</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Fecha actualización</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {noticias.map((n) => (
                  <tr key={n.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditar(n)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                        >
                          <HiPencil className="text-base" />
                        </button>
                        <button
                          onClick={() => handleEliminar(n.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <HiTrash className="text-base" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {n.imagen_url ? (
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-neutral-100">
                          <img src={n.imagen_url} alt={n.titulo} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-neutral-100" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800">{n.titulo}</p>
                      {n.subtitulo && <p className="text-xs text-neutral-400 mt-0.5">{n.subtitulo}</p>}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{formatFecha(n.fecha_creacion)}</td>
                    <td className="px-4 py-3 text-neutral-500">{formatFecha(n.fecha_actualizacion)}</td>
                    <td className="px-4 py-3">
                      {n.estado ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">
                          <HiEye className="text-xs" /> Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                          <HiEyeSlash className="text-xs" /> Oculto
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}