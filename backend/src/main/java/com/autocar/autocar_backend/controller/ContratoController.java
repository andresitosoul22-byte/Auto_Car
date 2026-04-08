package com.autocar.autocar_backend.controller;

import com.autocar.autocar_backend.dto.CrearContratoRequest;
import com.autocar.autocar_backend.model.Contrato;
import com.autocar.autocar_backend.service.ContratoService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contratos")
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CrearContratoRequest body) {
        try {
            Contrato c = contratoService.crear(body);
            return ResponseEntity.ok(c);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
