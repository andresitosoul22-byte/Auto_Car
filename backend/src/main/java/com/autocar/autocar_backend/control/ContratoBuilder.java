package com.autocar.autocar_backend.control;
import com.autocar.autocar_backend.model.*;

public class ContratoBuilder {

    private Cliente cliente;
    private Vehiculo vehiculo;
    private String plan;

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
        return new Contrato(cliente, vehiculo, plan, gps, seguro, cargador);
    }
}