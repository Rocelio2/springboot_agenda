package com.agenda.contactos.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agenda.contactos.model.AccionBitacora;
import com.agenda.contactos.model.Bitacora;
import com.agenda.contactos.service.BitacoraService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bitacora")
@RequiredArgsConstructor
public class BitacoraController {

    private final BitacoraService service;

    /** Últimos 200 movimientos, opcionalmente filtrados por acción. */
    @GetMapping
    public List<Bitacora> listar(@RequestParam(required = false) AccionBitacora accion) {
        return service.listar(accion);
    }
}
