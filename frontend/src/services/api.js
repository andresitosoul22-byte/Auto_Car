import { API_BASE } from "../utils/constants";

const JSON_HDR = { "Content-Type": "application/json" };

async function parseJsonBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function fetchVehiculos(ordenarPorAutonomia = false) {
  const q = new URLSearchParams({ ordenarPorAutonomia: String(ordenarPorAutonomia) });
  const res = await fetch(`${API_BASE}/vehiculos?${q}`);
  if (!res.ok) throw new Error("No se pudo obtener el inventario");
  return res.json();
}

export async function createVehiculo(body) {
  const res = await fetch(`${API_BASE}/vehiculos`, {
    method: "POST",
    headers: JSON_HDR,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await parseJsonBody(res);
    throw new Error(err?.error || err?.message || "No se pudo registrar el vehículo en el servidor");
  }
  return res.json();
}

export async function createContrato(body) {
  const res = await fetch(`${API_BASE}/contratos`, {
    method: "POST",
    headers: JSON_HDR,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await parseJsonBody(res);
    throw new Error(err?.error || "El servidor no pudo crear el contrato (¿existe la placa en el inventario del servidor?)");
  }
  return res.json();
}
