package com.autocar.autocar_backend.model;
public class Contrato {

    private Cliente cliente;
    private Vehiculo vehiculo;
    private String plan;

    private boolean gps;
    private boolean seguro;
    private boolean cargador;

    public Contrato(Cliente cliente, Vehiculo vehiculo, String plan,
                    boolean gps, boolean seguro, boolean cargador) {
        this.cliente = cliente;
        this.vehiculo = vehiculo;
        this.plan = plan;
        this.gps = gps;
        this.seguro = seguro;
        this.cargador = cargador;
    }

public String mostrarContrato() {
    return "=== CONTRATO ===\n"
            + "Cliente: " + cliente.getNombre() + "\n"
            + "Vehiculo: " + vehiculo.getPlaca() + "\n"
            + "Tipo: " + vehiculo.getTipo() + "\n"
            + "Autonomia: " + vehiculo.getAutonomia() + "\n" // 👈 AQUI
            + "Plan: " + plan + "\n"
            + "GPS: " + (gps ? "Si" : "No") + "\n"
            + "Seguro: " + (seguro ? "Si" : "No") + "\n"
            + "Cargador: " + (cargador ? "Si" : "No");
}
}