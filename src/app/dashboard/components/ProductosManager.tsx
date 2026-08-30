"use client";

import { useState, useEffect } from "react";
import { HiPencil, HiTrash, HiEye, HiEyeSlash, HiArrowUpTray } from "react-icons/hi2";
import type { Producto, ProductoForm } from "@/app/types/productos";
import { editarSuculenta, eliminarSuculenta, insertarSuculenta, obtenerSuculentas, subirImagen } from "@/app/dashboard/actions/actions";

const formVacio: ProductoForm = {
  nombre: "",
  descripcion: "",
  imagen_url: "",
  tipo: "",
  precio: 0,
  estado: true,
};

export default function SuculentasManager() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<ProductoForm>(formVacio);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await obtenerSuculentas();
      setProductos(data);
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
        await editarSuculenta({ ...form, imagen_url: imagenUrl });
      } else {
        await insertarSuculenta({ ...form, imagen_url: imagenUrl });
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

  const handleEditar = (p: Producto) => {
    setEditando(p);
    setForm({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion || "",
      imagen_url: p.imagen_url || "",
      tipo: p.tipo || "",
      precio: p.precio,
      estado: p.estado,
    });
    setArchivo(null);
    setPreview(p.imagen_url || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (p: Producto) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setError(null);
    try {
      await eliminarSuculenta(p.id, p.imagen_url || undefined);
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Suculentas</h1>

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
            {editando ? "Editar producto" : "Nuevo producto"}
          </h2>
          {editando && (
            <button type="button" onClick={cancelar} className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
              Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Nombre</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-neutral-400 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Tipo</label>
            <input
              type="text"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-neutral-400 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Precio ($)</label>
            <input
              type="number"
              required
              min={0}
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-neutral-400 transition-colors"
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

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-neutral-400 transition-colors resize-none"
            />
          </div>

          {preview && (
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-neutral-500 mb-2 block">Vista previa</label>
              <div className="h-40 w-40 overflow-hidden rounded-xl bg-neutral-100">
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
      ) : productos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-neutral-400 text-sm">No hay productos aún</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Acciones</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Imagen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditar(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                        >
                          <HiPencil className="text-base" />
                        </button>
                        <button
                          onClick={() => handleEliminar(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <HiTrash className="text-base" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.imagen_url ? (
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-neutral-100">
                          <img src={p.imagen_url} alt={p.nombre} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-neutral-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{p.nombre}</td>
                    <td className="px-4 py-3 text-neutral-500">{p.tipo || "—"}</td>
                    <td className="px-4 py-3 text-neutral-800">${p.precio.toLocaleString("es-CL")}</td>
                    <td className="px-4 py-3">
                      {p.estado ? (
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