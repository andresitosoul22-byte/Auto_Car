import { useState } from "react";
import { createVehiculo } from "../services/api";
import {
  DESCUENTO_LARGA_DURACION_PORCENTAJE,
  TIPOS_VEHICULO,
  UMBRAL_DIAS_DESCUENTO,
} from "../utils/constants";

function listadoFiltrado(vehicles, ordenado, filtroPlaca) {
  let list = [...vehicles];
  if (ordenado) {
    list.sort((a, b) => a.autonomia - b.autonomia);
  }
  const q = filtroPlaca.trim().toLowerCase();
  if (q) {
    list = list.filter((v) => v.placa?.toLowerCase().includes(q));
  }
  return list;
}

export default function AdminPanel({ vehicles, onVehiclesChange }) {
  const [tipo, setTipo] = useState("auto");
  const [placa, setPlaca] = useState("");
  const [autonomia, setAutonomia] = useState("");
  const [filtroPlaca, setFiltroPlaca] = useState("");
  const [ordenado, setOrdenado] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [syncServidor, setSyncServidor] = useState("");

  const listaMostrada = listadoFiltrado(vehicles, ordenado, filtroPlaca);

  const agregar = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setSyncServidor("");

    const aut = parseFloat(autonomia);
    if (!placa.trim() || Number.isNaN(aut) || aut <= 0) {
      setMensaje({ tipo: "error", texto: "Completa placa y una autonomía válida (km)." });
      return;
    }

    if (vehicles.some((v) => v.placa.toLowerCase() === placa.trim().toLowerCase())) {
      setMensaje({ tipo: "error", texto: "Ya existe un vehículo con esa placa en el inventario local." });
      return;
    }

    const nuevo = { tipo, placa: placa.trim(), autonomia: aut };
    const siguiente = [...vehicles, nuevo];
    onVehiclesChange(siguiente);
    setPlaca("");
    setAutonomia("");
    setMensaje({ tipo: "ok", texto: "Vehículo guardado en almacenamiento local (arreglo persistido en el navegador)." });

    try {
      await createVehiculo(nuevo);
      setSyncServidor("También registrado en Spring Boot (inventario en servidor).");
    } catch {
      setSyncServidor(
        "El servidor no respondió o rechazó la petición: los datos siguen solo en este navegador."
      );
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-1">Gestionar inventario</h2>
        <p className="text-sm text-slate-400 mb-4">
          Escenario del taller: creación por Factory Method en el backend; aquí el catálogo vive en{" "}
          <code className="text-emerald-300/90">localStorage</code> hasta conectar la base de datos.
        </p>

        <form onSubmit={agregar} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <label className="block text-sm">
            <span className="text-slate-400">Tipo</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
            >
              {TIPOS_VEHICULO.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm sm:col-span-1">
            <span className="text-slate-400">Placa</span>
            <input
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
              placeholder="ABC-123"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-400">Autonomía (km)</span>
            <input
              type="number"
              min="1"
              step="1"
              value={autonomia}
              onChange={(e) => setAutonomia(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
              placeholder="400"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 h-[42px]"
          >
            Agregar al inventario
          </button>
        </form>

        {mensaje && (
          <p
            className={`mt-4 text-sm rounded-lg px-3 py-2 ${
              mensaje.tipo === "ok" ? "bg-emerald-950/80 text-emerald-200" : "bg-red-950/60 text-red-200"
            }`}
          >
            {mensaje.texto}
          </p>
        )}
        {syncServidor && <p className="mt-2 text-sm text-slate-400">{syncServidor}</p>}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Listado ({listaMostrada.length})</h2>
          <div className="flex flex-wrap gap-2">
            <input
              value={filtroPlaca}
              onChange={(e) => setFiltroPlaca(e.target.value)}
              placeholder="Buscar por placa..."
              className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white min-w-[180px]"
            />
            <button
              type="button"
              onClick={() => setOrdenado((o) => !o)}
              className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              {ordenado ? "Quitar orden por autonomía" : "Ordenar por autonomía (km)"}
            </button>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <p className="text-slate-500 text-sm">No hay vehículos. Agrega al menos uno para el flujo de contratos.</p>
        ) : (
          <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden">
            {listaMostrada.map((v) => (
              <li key={`${v.placa}-${v.tipo}`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-950/40">
                <span className="font-medium text-white capitalize">{v.tipo}</span>
                <span className="text-slate-300">{v.placa}</span>
                <span className="text-emerald-400/90">{v.autonomia} km</span>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Referencia del taller: búsqueda por placa y orden por autonomía (en Java, el inventario usa un arreglo y bubble
          sort; descuento en contratos: más de {UMBRAL_DIAS_DESCUENTO} días → {DESCUENTO_LARGA_DURACION_PORCENTAJE}% ).
        </p>
      </section>
    </div>
  );
}
