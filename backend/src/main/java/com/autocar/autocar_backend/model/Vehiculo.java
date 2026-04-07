package com.autocar.autocar_backend.model;
public class Vehiculo {

    protected String placa;
    protected double autonomia;
    protected String tipo;

    public Vehiculo(String placa, double autonomia, String tipo) {
        this.placa = placa;
        this.autonomia = autonomia;
        this.tipo = tipo;
    }

    public String getPlaca() {
        return placa;
    }

    public double getAutonomia() {
        return autonomia;
    }

    public String getTipo() {
        return tipo;
    }

    public void mostrarInfo() {
        System.out.println("Tipo: " + tipo);
        System.out.println("Placa: " + placa);
        System.out.println("Autonomía: " + autonomia);
    }
}