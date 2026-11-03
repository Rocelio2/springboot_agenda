package com.agenda.contactos.dto;

import java.util.List;
import java.util.Map;

public record ResumenInforme(
        long totalContactos,
        long nuevosEsteMes,
        long contactosConOrganizacion,
        long totalOrganizaciones,
        List<Serie> registrosPorMes,
        List<Serie> topOrganizaciones,
        Map<String, Long> actividad) {

    public record Serie(String etiqueta, long total) {
    }
}
