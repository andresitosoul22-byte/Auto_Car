import { useMemo, useState } from "react";
import { TIPOS_VEHICULO } from "../utils/constants";

function toDate(maybeTimestamp) {
  if (!maybeTimestamp) return null;
  if (typeof maybeTimestamp.toDate === "function") return maybeTimestamp.toDate();
  return null;
}

function resolveContractLifecycle(contract) {
  const status = contract.status || "pendiente";
  if (status !== "aceptado") return status;

  const createdAt = toDate(contract.createdAt);
  const days = Number(contract.diasAlquiler || 0);
  if (!createdAt || days <= 0) return "aceptado";

  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt < new Date() ? "expirado" : "vigente";
}

const tabs = [
  { id: "resumen", label: "Resumen" },
  { id: "usuarios", label: "Usuarios" },
  { id: "inventario", label: "Inventario" },
  { id: "contratos", label: "Contratos" },
];

const statusClass = {
  pendiente: "bg-slate-700 text-slate-100",
  aceptado: "bg-emerald-700 text-emerald-100",
  vigente: "bg-emerald-700 text-emerald-100",
  expirado: "bg-amber-700 text-amber-100",
  declinado: "bg-rose-700 text-rose-100",
  cancelado: "bg-rose-700 text-rose-100",
};

export default function AdminPanel({
  vehicles,
  users,
  contracts,
  onCreateVehicle,
  onUpdateContractStatus,
}) {
  const [tipo, setTipo] = useState("auto");
  const [placa, setPlaca] = useState("");
  const [autonomia, setAutonomia] = useState("");
  const [filtro, setFiltro] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [activeTab, setActiveTab] = useState("resumen");

  const filtered = useMemo(() => {
    const term = filtro.trim().toLowerCase();
    return vehicles.filter((v) => (term ? v.placa.toLowerCase().includes(term) : true));
  }, [vehicles, filtro]);

  const contractSummary = useMemo(() => {
    return contracts.reduce(
      (acc, contract) => {
        const life = resolveContractLifecycle(contract);
        if (life === "vigente") acc.vigentes += 1;
        if (life === "expirado") acc.expirados += 1;
        if (life === "pendiente") acc.pendientes += 1;
        if (life === "declinado") acc.declinados += 1;
        if (life === "cancelado") acc.cancelados += 1;
        return acc;
      },
      { vigentes: 0, expirados: 0, pendientes: 0, declinados: 0, cancelados: 0 }
    );
  }, [contracts]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const autonomiaNum = Number(autonomia);
    if (!placa.trim() || autonomiaNum <= 0) {
      setMensaje("Completa placa y autonomia valida.");
      return;
    }
    await onCreateVehicle({ tipo, placa: placa.trim().toUpperCase(), autonomia: autonomiaNum });
    setMensaje("Vehiculo registrado correctamente.");
    setPlaca("");
    setAutonomia("");
  };

  const updateStatus = async (contractId, status) => {
    await onUpdateContractStatus(contractId, status);
    setMensaje(`Contrato actualizado a ${status}.`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-blue-900/10">
        <h2 className="text-lg font-semibold">Centro de control administrativo</h2>
        <p className="text-sm text-slate-400">Visualiza y administra usuarios, inventario y contratos.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded px-3 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {mensaje && <p className="mt-3 text-sm text-emerald-300">{mensaje}</p>}
      </section>

      {activeTab === "resumen" && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="font-semibold">Resumen general</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Usuarios</p>
              <p className="text-2xl font-semibold">{users.length}</p>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Vehiculos en inventario</p>
              <p className="text-2xl font-semibold">{vehicles.length}</p>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Contratos totales</p>
              <p className="text-2xl font-semibold">{contracts.length}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            <div className="rounded border border-emerald-800/60 bg-emerald-950/40 p-3 text-center">
              <p className="text-xs text-emerald-300">Vigentes</p>
              <p className="text-xl font-semibold">{contractSummary.vigentes}</p>
            </div>
            <div className="rounded border border-amber-800/60 bg-amber-950/40 p-3 text-center">
              <p className="text-xs text-amber-300">Expirados</p>
              <p className="text-xl font-semibold">{contractSummary.expirados}</p>
            </div>
            <div className="rounded border border-slate-700 bg-slate-950/60 p-3 text-center">
              <p className="text-xs text-slate-300">Pendientes</p>
              <p className="text-xl font-semibold">{contractSummary.pendientes}</p>
            </div>
            <div className="rounded border border-rose-800/60 bg-rose-950/40 p-3 text-center">
              <p className="text-xs text-rose-300">Declinados</p>
              <p className="text-xl font-semibold">{contractSummary.declinados}</p>
            </div>
            <div className="rounded border border-rose-800/60 bg-rose-950/40 p-3 text-center">
              <p className="text-xs text-rose-300">Cancelados</p>
              <p className="text-xl font-semibold">{contractSummary.cancelados}</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "usuarios" && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="font-semibold">Usuarios registrados ({users.length})</h3>
          <ul className="mt-4 space-y-2">
            {users.map((u) => (
              <li key={u.id} className="rounded border border-slate-800 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{u.email || "Sin correo"}</p>
                    <p className="text-xs text-slate-400">Rol: {u.role || "cliente"}</p>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      u.hasPassword ? "bg-emerald-700 text-emerald-100" : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    {u.hasPassword ? "Contrasena verificada" : "Sin huella de contrasena"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeTab === "inventario" && (
        <>
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-semibold">Registrar vehiculo</h3>
            <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-4">
              <select className="rounded bg-slate-950 border border-slate-700 px-3 py-2" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                {TIPOS_VEHICULO.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <input className="rounded bg-slate-950 border border-slate-700 px-3 py-2" placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} />
              <label className="relative">
                <input className="rounded w-full bg-slate-950 border border-slate-700 px-3 py-2" placeholder="Autonomia" type="number" min="1" value={autonomia} onChange={(e) => setAutonomia(e.target.value)} />
                <span className="group absolute right-2 top-2 inline-flex items-center justify-center w-5 h-5 rounded-full border border-slate-500 text-xs cursor-help">
                  ?
                  <span className="absolute right-0 top-7 w-60 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-300 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 z-10">
                    Autonomia: distancia aproximada en kilometros que el vehiculo puede recorrer.
                  </span>
                </span>
              </label>
              <button className="rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-2">Guardar</button>
            </form>
          </section>
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">Inventario ({filtered.length})</h3>
              <input className="rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm" placeholder="Buscar placa..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
            </div>
            <ul className="mt-4 space-y-2">
              {filtered.map((v) => (
                <li key={v.id} className="rounded border border-slate-800 px-3 py-2 flex justify-between">
                  <span className="capitalize">{v.tipo}</span>
                  <span>{v.placa}</span>
                  <span>{v.autonomia} km</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {activeTab === "contratos" && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="font-semibold">Contratos ({contracts.length})</h3>
          <ul className="mt-4 space-y-3">
            {contracts.map((c) => {
              const lifecycle = resolveContractLifecycle(c);
              return (
                <li key={c.id} className="rounded border border-slate-800 px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">
                      {c.clienteNombre || "Cliente"} - {c.placa}
                    </p>
                    <span className={`rounded px-2 py-1 text-xs capitalize ${statusClass[lifecycle] || statusClass.pendiente}`}>
                      {lifecycle}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    Plan: {c.plan} | Dias: {c.diasAlquiler} | Documento: {c.clienteDocumento || "-"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded bg-emerald-700 hover:bg-emerald-600 px-3 py-1 text-sm"
                      onClick={() => updateStatus(c.id, "aceptado")}
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      className="rounded bg-rose-700 hover:bg-rose-600 px-3 py-1 text-sm"
                      onClick={() => updateStatus(c.id, "declinado")}
                    >
                      Declinar
                    </button>
                    <button
                      type="button"
                      className="rounded bg-slate-700 hover:bg-slate-600 px-3 py-1 text-sm"
                      onClick={() => updateStatus(c.id, "cancelado")}
                    >
                      Cancelar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
