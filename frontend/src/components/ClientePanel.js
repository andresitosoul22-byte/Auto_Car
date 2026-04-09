import { useMemo, useState } from "react";
import { DESCUENTO_LARGA_DURACION_PORCENTAJE, PLANES, UMBRAL_DIAS_DESCUENTO } from "../utils/constants";

function descuentoDias(dias) {
  return dias > UMBRAL_DIAS_DESCUENTO ? DESCUENTO_LARGA_DURACION_PORCENTAJE : 0;
}

export default function ClientePanel({ vehicles, contracts, onCreateContract }) {
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDocumento, setClienteDocumento] = useState("");
  const [placa, setPlaca] = useState("");
  const [plan, setPlan] = useState("diario");
  const [diasAlquiler, setDiasAlquiler] = useState("7");
  const [gps, setGps] = useState(false);
  const [seguro, setSeguro] = useState(false);
  const [cargador, setCargador] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const dias = Number(diasAlquiler || 0);
  const descuento = useMemo(() => descuentoDias(dias), [dias]);
  const statusClass = {
    pendiente: "bg-slate-700 text-slate-100",
    aceptado: "bg-emerald-700 text-emerald-100",
    declinado: "bg-rose-700 text-rose-100",
    cancelado: "bg-rose-700 text-rose-100",
  };

  const submit = async (e) => {
    e.preventDefault();
    const vehiculo = vehicles.find((v) => v.placa === placa);
    if (!vehiculo) {
      setMensaje("Selecciona un vehiculo valido.");
      return;
    }
    const payload = {
      clienteNombre,
      clienteDocumento,
      placa,
      tipoVehiculo: vehiculo.tipo,
      plan,
      diasAlquiler: dias,
      porcentajeDescuento: descuento,
      gps,
      seguro,
      cargador,
    };
    await onCreateContract(payload);
    setMensaje("Contrato enviado para revision.");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-emerald-900/10">
        <h2 className="text-lg font-semibold">Panel cliente</h2>
        <p className="text-sm text-slate-400">
          Crea tu contrato de alquiler y revisa su estado en tiempo real.
        </p>
        <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="rounded bg-slate-950 border border-slate-700 px-3 py-2" placeholder="Nombre" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} />
          <input className="rounded bg-slate-950 border border-slate-700 px-3 py-2" placeholder="Documento" value={clienteDocumento} onChange={(e) => setClienteDocumento(e.target.value)} />
          <label className="md:col-span-2">
            <span className="text-sm text-slate-300 flex items-center gap-2 mb-1">
              Vehiculo
              <span className="group relative inline-flex items-center justify-center w-5 h-5 rounded-full border border-slate-500 text-xs cursor-help">
                ?
                <span className="absolute left-1/2 -translate-x-1/2 top-7 w-64 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-300 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 z-10">
                  La autonomia es la distancia aproximada (en kilometros) que recorre el vehiculo
                  con una carga o ciclo de energia.
                </span>
              </span>
            </span>
            <select className="rounded w-full bg-slate-950 border border-slate-700 px-3 py-2" value={placa} onChange={(e) => setPlaca(e.target.value)}>
              <option value="">Selecciona vehiculo</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.placa}>{v.placa} - {v.tipo}</option>
            ))}
            </select>
          </label>
          <select className="rounded bg-slate-950 border border-slate-700 px-3 py-2" value={plan} onChange={(e) => setPlan(e.target.value)}>
            {PLANES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <input className="rounded bg-slate-950 border border-slate-700 px-3 py-2" type="number" min="1" value={diasAlquiler} onChange={(e) => setDiasAlquiler(e.target.value)} />
          <div className="text-sm text-emerald-300">Descuento: {descuento}%</div>
          <label><input type="checkbox" checked={gps} onChange={(e) => setGps(e.target.checked)} /> GPS</label>
          <label><input type="checkbox" checked={seguro} onChange={(e) => setSeguro(e.target.checked)} /> Seguro</label>
          <label><input type="checkbox" checked={cargador} onChange={(e) => setCargador(e.target.checked)} /> Cargador</label>
          <button className="rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-2 md:col-span-2">Guardar contrato</button>
        </form>
        {mensaje && <p className="mt-3 text-sm text-emerald-300">{mensaje}</p>}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="font-semibold">Mis contratos ({contracts.length})</h3>
        <ul className="mt-4 space-y-2">
          {contracts.map((c) => (
            <li key={c.id} className="rounded border border-slate-800 px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>{c.placa} - {c.plan} - {c.diasAlquiler} dias</p>
                <span
                  className={`rounded px-2 py-1 text-xs capitalize ${
                    statusClass[c.status || "pendiente"] || statusClass.pendiente
                  }`}
                >
                  {c.status || "pendiente"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
