package com.autocar.autocar_backend.control;
import com.autocar.autocar_backend.model.Vehiculo;

public class Inventario {

    private Vehiculo[] vehiculos;
    private int contador;

    public Inventario(int tamaño) {
        vehiculos = new Vehiculo[tamaño];
        contador = 0;
    }

    public void agregarVehiculo(Vehiculo v) {
        if (contador < vehiculos.length) {
            vehiculos[contador] = v;
            contador++;
        } else {
            System.out.println("Inventario lleno");
        }
    }

    public Vehiculo buscarPorPlaca(String placa) {
        for (int i = 0; i < contador; i++) {
            if (vehiculos[i].getPlaca().equalsIgnoreCase(placa)) {
                return vehiculos[i];
            }
        }
        return null;
    }

    public void ordenarPorAutonomia() {
        for (int i = 0; i < contador - 1; i++) {
            for (int j = 0; j < contador - i - 1; j++) {
                if (vehiculos[j].getAutonomia() > vehiculos[j + 1].getAutonomia()) {
                    Vehiculo temp = vehiculos[j];
                    vehiculos[j] = vehiculos[j + 1];
                    vehiculos[j + 1] = temp;
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