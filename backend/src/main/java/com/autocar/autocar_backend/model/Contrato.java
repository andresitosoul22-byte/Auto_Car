package com.autocar.autocar_backend.model;

public class Contrato {

    private Cliente cliente;
    private Vehiculo vehiculo;
    private String plan;
    private int diasAlquiler;
    /** Porcentaje 0–100 aplicado cuando diasAlquiler &gt; 30 (regla del taller). */
    private double porcentajeDescuento;

    private boolean gps;
    private boolean seguro;
    private boolean cargador;

    public Contrato(Cliente cliente, Vehiculo vehiculo, String plan,
                    boolean gps, boolean seguro, boolean cargador,
                    int diasAlquiler, double porcentajeDescuento) {
        this.cliente = cliente;
        this.vehiculo = vehiculo;
        this.plan = plan;
        this.gps = gps;
        this.seguro = seguro;
        this.cargador = cargador;
        this.diasAlquiler = diasAlquiler;
        this.porcentajeDescuento = porcentajeDescuento;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public Vehiculo getVehiculo() {
        return vehiculo;
    }

    public String getPlan() {
        return plan;
    }

    public int getDiasAlquiler() {
        return diasAlquiler;
    }

    public double getPorcentajeDescuento() {
        return porcentajeDescuento;
    }

    public boolean isGps() {
        return gps;
    }

    public boolean isSeguro() {
        return seguro;
    }

    public boolean isCargador() {
        return cargador;
    }

    public String mostrarContrato() {
        return "=== CONTRATO ===\n"
                + "Cliente: " + cliente.getNombre() + "\n"
                + "Vehiculo: " + vehiculo.getPlaca() + "\n"
                + "Tipo: " + vehiculo.getTipo() + "\n"
                + "Autonomia: " + vehiculo.getAutonomia() + "\n"
                + "Plan: " + plan + "\n"
                + "Dias: " + diasAlquiler + "\n"
                + "Descuento (%): " + porcentajeDescuento + "\n"
                + "GPS: " + (gps ? "Si" : "No") + "\n"
                + "Seguro: " + (seguro ? "Si" : "No") + "\n"
                + "Cargador: " + (cargador ? "Si" : "No");
    }
}