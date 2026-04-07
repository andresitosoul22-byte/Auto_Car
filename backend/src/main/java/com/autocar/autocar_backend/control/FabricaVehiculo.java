package com.autocar.autocar_backend.control;
import com.autocar.autocar_backend.model.Vehiculo;
import com.autocar.autocar_backend.model.Van;
import com.autocar.autocar_backend.model.Camion;
import com.autocar.autocar_backend.model.Auto;

public class FabricaVehiculo {

    public static Vehiculo crearVehiculo(String tipo, String placa, double autonomia) {

        switch (tipo.toLowerCase()) {
            case "auto":
                return new Auto(placa, autonomia);
            case "van":
                return new Van(placa, autonomia);
            case "camion":
                return new Camion(placa, autonomia);
            default:
                System.out.println("Tipo no valido");
                return null;
        }
    }
}
