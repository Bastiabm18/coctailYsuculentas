"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  obtenerVentas,
  gestionarVenta,
  finalizarVenta,
  cancelarVenta,
} from "@/app/dashboard/actions/actions";
import type { Venta } from "@/app/types/productos";

const BADGE: Record<string, { clase: string; punto: string; texto: string }> = {
  pendiente: {
    clase: "bg-amber-50 text-amber-700 ring-amber-600/20",
    punto: "bg-amber-500",
    texto: "Pendiente",
  },
  en_gestion: {
    clase: "bg-blue-50 text-blue-700 ring-blue-600/20",
    punto: "bg-blue-500",
    texto: "En gestión",
  },
  finalizada: {
    clase: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    punto: "bg-emerald-500",
    texto: "Finalizada",
  },
  cancelada: {
    clase: "bg-rose-50 text-rose-700 ring-rose-600/20",
    punto: "bg-rose-500",
    texto: "Cancelada",
  },
};

const clp = (n: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

export default function VentasManager() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
const [desde, setDesde] = useState("");
const [hasta, setHasta] = useState("");

const ventasFiltradas = useMemo(() => {
  return ventas.filter((v) => {
    if (filtroEstado !== "todas" && v.estado !== filtroEstado) return false;

    // fecha local en formato YYYY-MM-DD
    const dia = new Date(v.fecha_creacion).toLocaleDateString("en-CA");
    if (desde && dia < desde) return false;
    if (hasta && dia > hasta) return false;

    return true;
  });
}, [ventas, filtroEstado, desde, hasta]);

const hayFiltros = filtroEstado !== "todas" || desde !== "" || hasta !== "";

const limpiarFiltros = () => {
  setFiltroEstado("todas");
  setDesde("");
  setHasta("");
};

  const cargar = useCallback(async () => {
    try {
      setVentas(await obtenerVentas());
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Error al cargar ventas");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void cargar();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [cargar]);

  const ejecutar = async (
    id: string,
    accion: (id: string) => Promise<void>,
    confirmacion?: string
  ) => {
    if (confirmacion && !window.confirm(confirmacion)) return;
    setProcesando(id);
    try {
      await accion(id);
      await cargar();
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo actualizar la venta");
    } finally {
      setProcesando(null);
    }
  };

  if (cargando)
    return (
      <div className="flex items-center justify-center gap-3 p-16 text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        Cargando ventas...
      </div>
    );

  return (
    <div className="p-4 md:p-8">
<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
  <div>
    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
      Ventas
    </h1>
    <p className="mt-1 text-sm text-slate-500">
      {ventasFiltradas.length} de {ventas.length}{" "}
      {ventas.length === 1 ? "venta" : "ventas"}
    </p>
  </div>

    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Estado</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_gestion">En gestión</option>
          <option value="finalizada">Finalizada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Desde</label>
        <input
          type="date"
          value={desde}
          max={hasta || undefined}
          onChange={(e) => setDesde(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Hasta</label>
        <input
          type="date"
          value={hasta}
          min={desde || undefined}
          onChange={(e) => setHasta(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {hayFiltros && (
        <button
          onClick={limpiarFiltros}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          Limpiar
        </button>
      )}
    </div>
  </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Fecha Compra</th>
                <th className="px-5 py-3.5">Fecha Entrega</th>
                <th className="px-5 py-3.5">Dirección</th>
                <th className="px-5 py-3.5">Productos</th>
                <th className="px-5 py-3.5 text-right">Total</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ventasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                    {hayFiltros ? "No hay ventas con esos filtros." : "No hay ventas todavía."}
                  </td>
                </tr>
              )}
              
              {ventasFiltradas.map((v) => {
                const ocupada = procesando === v.id;
                const badge = BADGE[v.estado] ?? {
                  clase: "bg-slate-50 text-slate-700 ring-slate-600/20",
                  punto: "bg-slate-400",
                  texto: v.estado,
                };
                const fecha = new Date(v.fecha_creacion);
                const fecha_entrega = v.fecha_entrega
                  ? new Date(v.fecha_entrega)
                  : null;

                return (
                  <tr
                    key={v.id}
                    className="align-top transition-colors hover:bg-slate-50/60"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="font-medium text-slate-900">
                        {fecha.toLocaleDateString("es-CL", { dateStyle: "medium" })}
                      </div>
                      <div className="text-xs text-slate-500">
                        {fecha.toLocaleTimeString("es-CL", { timeStyle: "short" })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                        <div className="font-medium text-slate-900">
                        {fecha_entrega?.toLocaleDateString("es-CL",{dateStyle: "medium"})}
                      </div>
                          <div className="text-xs text-slate-500">
                        {fecha_entrega?.toLocaleTimeString("es-CL", { timeStyle: "short" })}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{v.direccion}</div>
                      <div className="text-xs text-slate-500">
                        {v.ciudad}, {v.region}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">{v.telefono}</div>
                      {v.latitud != null && v.longitud != null && (
                        <a
                          href={`https://www.google.com/maps?q=${v.latitud},${v.longitud}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          Ver en mapa →
                        </a>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <ul className="space-y-1.5">
                        {v.detalles.map((d) => (
                          <li key={d.id} className="flex items-center gap-2 text-xs">
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-slate-100 px-1.5 font-semibold text-slate-700">
                              {d.cantidad}×
                            </span>
                            <span className="font-medium text-slate-800">
                              {d.nombre_producto}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] capitalize text-slate-500">
                              {d.tipo_producto}
                            </span>
                            <span className="text-slate-400">{clp(d.precio)}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right text-base font-semibold tabular-nums text-slate-900">
                      {clp(v.total)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center whitespace-nowrap gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badge.clase}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${badge.punto}`} />
                        {badge.texto}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        {v.estado === "pendiente" && (
                          <button
                            disabled={ocupada}
                            onClick={() => ejecutar(v.id, gestionarVenta)}
                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Gestionar
                          </button>
                        )}
                        {v.estado === "en_gestion" && (
                          <button
                            disabled={ocupada}
                            onClick={() =>
                              ejecutar(v.id, finalizarVenta, "¿Finalizar esta venta?")
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Finalizar
                          </button>
                        )}
                        {(v.estado === "pendiente" || v.estado === "en_gestion") && (
                          <button
                            disabled={ocupada}
                            onClick={() =>
                              ejecutar(v.id, cancelarVenta, "¿Cancelar esta venta?")
                            }
                            className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}