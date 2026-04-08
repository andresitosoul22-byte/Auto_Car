package com.autocar.autocar_backend.service;

import com.autocar.autocar_backend.control.Inventario;
import com.autocar.autocar_backend.model.Vehiculo;
import org.springframework.stereotype.Service;

/**
 * Servicio de aplicación que encapsula el inventario basado en arreglo fijo
 * (requisito del taller: array de objetos, no lista dinámica).
 */
@Service
public class InventarioService {

    private static final int CAPACIDAD = 100;
    private final Inventario inventario = new Inventario(CAPACIDAD);

    public void agregar(Vehiculo v) {
        inventario.agregarVehiculo(v);
    }

    /**
     * Lista el inventario. Si {@code ordenarPorAutonomia} es true, devuelve copia ordenada sin mutar el estado interno
     * (GET idempotente).
     */
    public Vehiculo[] listar(boolean ordenarPorAutonomia) {
        if (ordenarPorAutonomia) {
            return inventario.copiaOrdenadaPorAutonomia();
        }
        return inventario.getVehiculos();
    }

    public Vehiculo buscarPorPlaca(String placa) {
        return inventario.buscarPorPlaca(placa);
    }
}
