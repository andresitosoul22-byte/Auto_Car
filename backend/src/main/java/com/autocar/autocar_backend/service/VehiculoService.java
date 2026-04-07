package com.autocar.autocar_backend.service;
import com.autocar.autocar_backend.control.Inventario;
import com.autocar.autocar_backend.model.Vehiculo;

public class VehiculoService {

    private Inventario inventario;

    public VehiculoService() {
        inventario = new Inventario(10);
    }

    public Vehiculo agregarVehiculo(Vehiculo v) {
        inventario.agregarVehiculo(v);
        return v;
    }

    public Vehiculo[] listarVehiculos() {
        return inventario.getVehiculos();
    }
}