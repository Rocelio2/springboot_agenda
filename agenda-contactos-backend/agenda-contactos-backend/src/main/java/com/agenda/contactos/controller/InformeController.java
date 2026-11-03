package com.agenda.contactos.controller;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agenda.contactos.dto.ResumenInforme;
import com.agenda.contactos.service.InformeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/informes")
@RequiredArgsConstructor
public class InformeController {

    private final InformeService service;

    @GetMapping("/resumen")
    public ResumenInforme resumen() {
        return service.resumen();
    }

    @GetMapping("/contactos.csv")
    public ResponseEntity<byte[]> exportarContactos() {
        String archivo = "contactos-" + LocalDate.now() + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + archivo + "\"")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(service.contactosCsv());
    }
}
