package com.agenda.contactos.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agenda.contactos.model.AccionBitacora;
import com.agenda.contactos.model.Bitacora;
import com.agenda.contactos.model.Contacto;
import com.agenda.contactos.repository.BitacoraRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BitacoraService {

    private final BitacoraRepository repository;

    @Transactional(readOnly = true)
    public List<Bitacora> listar(AccionBitacora accion) {
        return accion == null
                ? repository.findTop200ByOrderByFechaDescIdDesc()
                : repository.findTop200ByAccionOrderByFechaDescIdDesc(accion);
    }

    @Transactional
    public void registrar(AccionBitacora accion, Contacto contacto, String detalle) {
        repository.save(Bitacora.builder()
                .accion(accion)
                .contactoId(contacto.getId())
                .contactoNombre(contacto.getNombre() + " " + contacto.getApellido())
                .detalle(detalle)
                .build());
    }
}
