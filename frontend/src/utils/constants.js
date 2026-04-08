export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const STORAGE_VEHICLES = "autocar.vehiculos";
export const STORAGE_CONTRACTS = "autocar.contratos";

/** Alineado con {@code ContratoBuilder} en el backend */
export const UMBRAL_DIAS_DESCUENTO = 30;
export const DESCUENTO_LARGA_DURACION_PORCENTAJE = 10;

export const TIPOS_VEHICULO = [
  { value: "auto", label: "Auto" },
  { value: "van", label: "Van" },
  { value: "camion", label: "Camión ligero" },
];

export const PLANES = [
  { value: "diario", label: "Diario" },
  { value: "semanal", label: "Semanal" },
  { value: "mensual", label: "Mensual" },
];
