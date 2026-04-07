package com.autocar.autocar_backend.controller;
import com.autocar.autocar_backend.control.Inventario;
import com.autocar.autocar_backend.model.Vehiculo;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

    private Inventario inventario = new Inventario(10);

    @GetMapping
    public Vehiculo[] listar() {
        return inventario.getVehiculos();
    }

    @PostMapping
    public Vehiculo agregar(@RequestBody Vehiculo v) {
        inventario.agregarVehiculo(v);
        return v;
    }
}