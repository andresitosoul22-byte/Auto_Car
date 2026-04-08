import { useState } from "react";
import { createContrato } from "../services/api";
import {
  DESCUENTO_LARGA_DURACION_PORCENTAJE,
  PLANES,
  UMBRAL_DIAS_DESCUENTO,
} from "../utils/constants";

function calcularDescuento(dias) {
  return dias > UMBRAL_DIAS_DESCUENTO ? DESCUENTO_LARGA_DURACION_PORCENTAJE : 0;
}

export default function ClientePanel({ vehicles, contracts, onContractsChange }) {
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [placaSel, setPlacaSel] = useState("");
  const [plan, setPlan] = useState("diario");
  const [dias, setDias] = useState("7");
  const [gps, setGps] = useState(false);
  const [seguro, setSeguro] = useState(false);
  const [cargador, setCargador] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [servidorMsg, setServidorMsg] = useState("");

  const diasNum = parseInt(dias, 10);
  const descuentoPrevisto = Number.isFinite(diasNum) ? calcularDescuento(diasNum) : 0;

  const vehiculoSel = vehicles.find((v) => v.placa === placaSel);

  const registrarContrato = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setServidorMsg("");

    if (!nombre.trim() || !documento.trim()) {
      setMensaje({ tipo: "error", texto: "Nombre y documento del cliente son obligatorios." });
      return;
    }
    if (!vehiculoSel) {
      setMensaje({ tipo: "error", texto: "Selecciona un vehículo de la flota." });
      return;
    }
    if (!Number.isFinite(diasNum) || diasNum <= 0) {
      setMensaje({ tipo: "error", texto: "Indica una duración en días mayor a cero." });
      return;
    }

    const porcentajeDescuento = calcularDescuento(diasNum);
    const contrato = {
      id: crypto.randomUUID(),
      creadoEn: new Date().toISOString(),
      clienteNombre: nombre.trim(),
      clienteDocumento: documento.trim(),
      placa: vehiculoSel.placa,
      tipoVehiculo: vehiculoSel.tipo,
      autonomia: vehiculoSel.autonomia,
      plan,
      diasAlquiler: diasNum,
      porcentajeDescuento,
      gps,
      seguro,
      cargador,
    };

    const todos = [contrato, ...contracts];
    onContractsChange(todos);

    setMensaje({
      tipo: "ok",
      texto: `Contrato guardado localmente. Descuento aplicado: ${porcentajeDescuento}%.`,
    });

    try {
      await createContrato({
        clienteNombre: contrato.clienteNombre,
        clienteDocumento: contrato.clienteDocumento,
        placaVehiculo: contrato.placa,
        plan: contrato.plan,
        diasAlquiler: contrato.diasAlquiler,
        gps: contrato.gps,
        seguro: contrato.seguro,
        cargador: contrato.cargador,
      });
      setServidorMsg("Contrato reproducido en el backend vía patrón Builder.");
    } catch {
      setServidorMsg(
        "No se pudo replicar en el servidor (inventario del backend puede no tener esa placa). El contrato sigue en tu navegador."
      );
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-1">Nuevo contrato de alquiler</h2>
        <p className="text-sm text-slate-400 mb-4">
          Datos obligatorios: cliente, vehículo y plan. Accesorios opcionales: GPS, seguro, cargador portátil. Regla del
          taller: más de {UMBRAL_DIAS_DESCUENTO} días → {DESCUENTO_LARGA_DURACION_PORCENTAJE}% de descuento.
        </p>

        <form onSubmit={registrarContrato} className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-400">Cliente</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
              placeholder="Nombre completo"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-400">Documento</span>
            <input
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
              placeholder="ID / NIT"
            />
          </label>

          <label className="block text-sm">
            <span className="text-slate-400">Vehículo</span>
            <select
              value={placaSel}
              onChange={(e) => setPlacaSel(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
            >
              <option value="">— Seleccionar —</option>
              {vehicles.map((v) => (
                <option key={v.placa} value={v.placa}>
                  {v.placa} · {v.tipo} · {v.autonomia} km
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-slate-400">Plan</span>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
            >
              {PLANES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm lg:col-span-2">
            <span className="text-slate-400">Duración (días)</span>
            <input
              type="number"
              min="1"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              className="mt-1 w-full max-w-xs rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-white"
            />
            <span className="mt-2 block text-sm text-emerald-400/90">
              Descuento estimado por política AutoCar: {descuentoPrevisto}%
            </span>
          </label>

          <fieldset className="lg:col-span-2 flex flex-wrap gap-4 text-sm">
            <legend className="text-slate-400 mb-2">Accesorios opcionales</legend>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={gps} onChange={(e) => setGps(e.target.checked)} className="rounded border-slate-600" />
              GPS
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={seguro}
                onChange={(e) => setSeguro(e.target.checked)}
                className="rounded border-slate-600"
              />
              Seguro
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cargador}
                onChange={(e) => setCargador(e.target.checked)}
                className="rounded border-slate-600"
              />
              Cargador portátil
            </label>
          </fieldset>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5"
            >
              Guardar contrato (local)
            </button>
          </div>
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
        {servidorMsg && <p className="mt-2 text-sm text-slate-400">{servidorMsg}</p>}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Mis contratos registrados ({contracts.length})</h2>
        {contracts.length === 0 ? (
          <p className="text-slate-500 text-sm">Aún no hay contratos en este navegador.</p>
        ) : (
          <ul className="space-y-3">
            {contracts.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-300"
              >
                <div className="flex flex-wrap justify-between gap-2 text-white font-medium">
                  <span>{c.clienteNombre}</span>
                  <span className="text-slate-400 font-normal">{new Date(c.creadoEn).toLocaleString()}</span>
                </div>
                <p className="mt-1">
                  {c.placa} · Plan {c.plan} · {c.diasAlquiler} días
                  {c.porcentajeDescuento > 0 ? ` · Descuento ${c.porcentajeDescuento}%` : ""}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  GPS {c.gps ? "Sí" : "No"} · Seguro {c.seguro ? "Sí" : "No"} · Cargador {c.cargador ? "Sí" : "No"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
