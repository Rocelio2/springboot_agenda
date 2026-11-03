package com.agenda.contactos.service;

import java.nio.charset.StandardCharsets;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agenda.contactos.dto.ResumenInforme;
import com.agenda.contactos.dto.ResumenInforme.Serie;
import com.agenda.contactos.model.AccionBitacora;
import com.agenda.contactos.model.Contacto;
import com.agenda.contactos.repository.BitacoraRepository;
import com.agenda.contactos.repository.ContactoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InformeService {

    private static final int MESES = 6;
    private static final int TOP_ORGANIZACIONES = 5;

    private final ContactoRepository contactoRepository;
    private final BitacoraRepository bitacoraRepository;

    @Transactional(readOnly = true)
    public ResumenInforme resumen() {
        List<Contacto> contactos = contactoRepository.findAll();
        YearMonth mesActual = YearMonth.now();

        Map<YearMonth, Long> porMes = contactos.stream()
                .map(Contacto::getFechaRegistro)
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(YearMonth::from, Collectors.counting()));

        List<Serie> registrosPorMes = IntStream.range(0, MESES)
                .mapToObj(i -> mesActual.minusMonths(MESES - 1 - i))
                .map(mes -> new Serie(mes.toString(), porMes.getOrDefault(mes, 0L)))
                .toList();

        Map<String, Long> organizaciones = contactos.stream()
                .map(Contacto::getOrganizacion)
                .filter(e -> e != null && !e.isBlank())
                .collect(Collectors.groupingBy(String::trim, Collectors.counting()));

        List<Serie> topOrganizaciones = organizaciones.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed()
                        .thenComparing(Map.Entry.comparingByKey()))
                .limit(TOP_ORGANIZACIONES)
                .map(e -> new Serie(e.getKey(), e.getValue()))
                .toList();

        Map<String, Long> actividad = new LinkedHashMap<>();
        for (AccionBitacora accion : AccionBitacora.values()) {
            actividad.put(accion.name(), bitacoraRepository.countByAccion(accion));
        }

        return new ResumenInforme(
                contactos.size(),
                porMes.getOrDefault(mesActual, 0L),
                organizaciones.values().stream().mapToLong(Long::longValue).sum(),
                organizaciones.size(),
                registrosPorMes,
                topOrganizaciones,
                actividad);
    }

    /** CSV en UTF-8 con BOM para que Excel muestre bien los acentos. */
    @Transactional(readOnly = true)
    public byte[] contactosCsv() {
        StringBuilder csv = new StringBuilder("﻿");
        csv.append("ID,Nombre,Apellido,Email,Teléfono,Organización,Fecha de registro\n");
        for (Contacto c : contactoRepository.findAllByOrderByIdDesc()) {
            csv.append(c.getId()).append(',')
                    .append(celda(c.getNombre())).append(',')
                    .append(celda(c.getApellido())).append(',')
                    .append(celda(c.getEmail())).append(',')
                    .append(celda(c.getTelefono())).append(',')
                    .append(celda(c.getOrganizacion())).append(',')
                    .append(c.getFechaRegistro() == null ? "" : c.getFechaRegistro())
                    .append('\n');
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static String celda(String valor) {
        if (valor == null) {
            return "";
        }
        if (valor.contains(",") || valor.contains("\"") || valor.contains("\n")) {
            return "\"" + valor.replace("\"", "\"\"") + "\"";
        }
        return valor;
    }
}
