package com.autocar.autocar_backend.control;

import com.autocar.autocar_backend.model.Auto;
import com.autocar.autocar_backend.model.Camion;
import com.autocar.autocar_backend.model.Van;
import com.autocar.autocar_backend.model.Vehiculo;

/**
 * Factory Method (variación centralizada): el cliente pide un vehículo por tipo simbólico
 * sin instanciar subclases ni encadenar if/switch en el controlador.
 */
public final class FabricaVehiculo {

    private FabricaVehiculo() {
    }

    public static Vehiculo crearVehiculo(String tipo, String placa, double autonomia) {
        if (tipo == null) {
            return null;
        }
        switch (tipo.toLowerCase()) {
            case "auto":
                return new Auto(placa, autonomia);
            case "van":
                return new Van(placa, autonomia);
            case "camion":
                return new Camion(placa, autonomia);
            default:
                return null;
        }
    }
}
