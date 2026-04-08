package com.autocar.autocar_backend.service;

import com.autocar.autocar_backend.control.ContratoBuilder;
import com.autocar.autocar_backend.dto.CrearContratoRequest;
import com.autocar.autocar_backend.model.Cliente;
import com.autocar.autocar_backend.model.Contrato;
import com.autocar.autocar_backend.model.Vehiculo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ContratoService {

    private final InventarioService inventarioService;

    public ContratoService(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    public Contrato crear(CrearContratoRequest req) {
        Vehiculo vehiculo = inventarioService.buscarPorPlaca(req.getPlacaVehiculo());
        if (vehiculo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe un vehículo con esa placa en el inventario");
        }

        Cliente cliente = new Cliente(req.getClienteNombre(), req.getClienteDocumento());
        ContratoBuilder builder = new ContratoBuilder()
                .setCliente(cliente)
                .setVehiculo(vehiculo)
                .setPlan(req.getPlan())
                .setDiasAlquiler(req.getDiasAlquiler());

        if (req.isGps()) {
            builder.agregarGPS();
        }
        if (req.isSeguro()) {
            builder.agregarSeguro();
        }
        if (req.isCargador()) {
            builder.agregarCargador();
        }

        return builder.build();
    }
}
