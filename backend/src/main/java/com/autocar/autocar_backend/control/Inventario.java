package com.autocar.autocar_backend.control;

import com.autocar.autocar_backend.model.Vehiculo;

/**
 * Inventario basado en arreglo fijo (taller): agregar, buscar por placa y ordenar por autonomía.
 */
public class Inventario {

    private Vehiculo[] vehiculos;
    private int contador;

    public Inventario(int tamaño) {
        vehiculos = new Vehiculo[tamaño];
        contador = 0;
    }

    public void agregarVehiculo(Vehiculo v) {
        if (v == null) {
            return;
        }
        if (contador < vehiculos.length) {
            vehiculos[contador] = v;
            contador++;
        } else {
            System.out.println("Inventario lleno");
        }
    }

    public Vehiculo buscarPorPlaca(String placa) {
        if (placa == null) {
            return null;
        }
        for (int i = 0; i < contador; i++) {
            if (placa.equalsIgnoreCase(vehiculos[i].getPlaca())) {
                return vehiculos[i];
            }
        }
        return null;
    }

    /**
     * Ordena el arreglo interno por autonomía (bubble sort). Mutador: no usar en lecturas HTTP idempotentes.
     */
    public void ordenarPorAutonomia() {
        ordenarPorAutonomiaEn(vehiculos, contador);
    }

    /**
     * Copia los vehículos activos y devuelve una copia ordenada por autonomía sin modificar el inventario interno.
     */
    public Vehiculo[] copiaOrdenadaPorAutonomia() {
        Vehiculo[] copia = new Vehiculo[contador];
        System.arraycopy(vehiculos, 0, copia, 0, contador);
        ordenarPorAutonomiaEn(copia, contador);
        return copia;
    }

    private static void ordenarPorAutonomiaEn(Vehiculo[] arr, int n) {
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j].getAutonomia() > arr[j + 1].getAutonomia()) {
                    Vehiculo temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public Vehiculo[] getVehiculos() {
        Vehiculo[] resultado = new Vehiculo[contador];
        for (int i = 0; i < contador; i++) {
            resultado[i] = vehiculos[i];
        }
        return resultado;
    }
}