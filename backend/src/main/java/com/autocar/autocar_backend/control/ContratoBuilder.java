package com.autocar.autocar_backend.control;

import com.autocar.autocar_backend.model.Cliente;
import com.autocar.autocar_backend.model.Contrato;
import com.autocar.autocar_backend.model.Vehiculo;

/**
 * Patrón Builder: ensambla un contrato con datos obligatorios y accesorios opcionales,
 * validando reglas de negocio antes de exponer el objeto (p. ej. descuento por larga duración).
 */
public class ContratoBuilder {

    public static final double DESCUENTO_LARGA_DURACION_PORCENTAJE = 10.0;
    public static final int UMBRAL_DIAS_DESCUENTO = 30;

    private Cliente cliente;
    private Vehiculo vehiculo;
    private String plan;
    private int diasAlquiler;

    private boolean gps;
    private boolean seguro;
    private boolean cargador;

    public ContratoBuilder setCliente(Cliente cliente) {
        this.cliente = cliente;
        return this;
    }

    public ContratoBuilder setVehiculo(Vehiculo vehiculo) {
        this.vehiculo = vehiculo;
        return this;
    }

    public ContratoBuilder setPlan(String plan) {
        this.plan = plan;
        return this;
    }

    public ContratoBuilder setDiasAlquiler(int diasAlquiler) {
        this.diasAlquiler = diasAlquiler;
        return this;
    }

    public ContratoBuilder agregarGPS() {
        this.gps = true;
        return this;
    }

    public ContratoBuilder agregarSeguro() {
        this.seguro = true;
        return this;
    }

    public ContratoBuilder agregarCargador() {
        this.cargador = true;
        return this;
    }

    public Contrato build() {
        if (cliente == null || vehiculo == null || plan == null || plan.isBlank()) {
            throw new IllegalStateException("Cliente, vehículo y plan son obligatorios");
        }
        if (diasAlquiler <= 0) {
            throw new IllegalStateException("La duración del alquiler debe ser mayor a cero");
        }

        double descuento = diasAlquiler > UMBRAL_DIAS_DESCUENTO ? DESCUENTO_LARGA_DURACION_PORCENTAJE : 0.0;
        return new Contrato(cliente, vehiculo, plan, gps, seguro, cargador, diasAlquiler, descuento);
    }
}