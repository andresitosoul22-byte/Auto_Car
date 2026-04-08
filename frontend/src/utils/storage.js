import { STORAGE_CONTRACTS, STORAGE_VEHICLES } from "./constants";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadVehicles() {
  return readJson(STORAGE_VEHICLES, []);
}

export function saveVehicles(list) {
  writeJson(STORAGE_VEHICLES, list);
}

export function loadContracts() {
  return readJson(STORAGE_CONTRACTS, []);
}

export function saveContracts(list) {
  writeJson(STORAGE_CONTRACTS, list);
}
