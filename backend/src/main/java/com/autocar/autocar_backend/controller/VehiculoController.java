package com.autocar.autocar_backend.controller;

import com.autocar.autocar_backend.control.FabricaVehiculo;
import com.autocar.autocar_backend.dto.CrearVehiculoRequest;
import com.autocar.autocar_backend.model.Vehiculo;
import com.autocar.autocar_backend.service.InventarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

    private final InventarioService inventarioService;

    public VehiculoController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping
    public Vehiculo[] listar(@RequestParam(name = "ordenarPorAutonomia", defaultValue = "false") boolean ordenarPorAutonomia) {
        return inventarioService.listar(ordenarPorAutonomia);
    }

    @GetMapping("/placa/{placa}")
    public ResponseEntity<Vehiculo> buscarPorPlaca(@PathVariable String placa) {
        Vehiculo v = inventarioService.buscarPorPlaca(placa);
        return v == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(v);
    }

    @PostMapping
    public ResponseEntity<Vehiculo> agregar(@RequestBody CrearVehiculoRequest req) {
        if (req.getPlaca() != null && inventarioService.buscarPorPlaca(req.getPlaca()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Vehiculo creado = FabricaVehiculo.crearVehiculo(req.getTipo(), req.getPlaca(), req.getAutonomia());
        if (creado == null) {
            return ResponseEntity.badRequest().build();
        }
        inventarioService.agregar(creado);
        return ResponseEntity.ok(creado);
    }
}
