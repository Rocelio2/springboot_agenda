package com.agenda.contactos.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agenda.contactos.exception.ConflictoException;
import com.agenda.contactos.exception.RecursoNoEncontradoException;
import com.agenda.contactos.model.AccionBitacora;
import com.agenda.contactos.model.Contacto;
import com.agenda.contactos.repository.ContactoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactoService {

    private final ContactoRepository repository;
    private final BitacoraService bitacora;

    @Transactional(readOnly = true)
    public List<Contacto> listar(String q) {
        if (q == null || q.isBlank()) {
            return repository.findAllByOrderByIdDesc();
        }
        return repository.buscar(q.trim());
    }

    @Transactional(readOnly = true)
    public Contacto obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el contacto con id " + id));
    }

    @Transactional
    public Contacto crear(Contacto contacto) {
        if (repository.existsByEmailIgnoreCase(contacto.getEmail())) {
            throw new ConflictoException("Ya existe un contacto con el email " + contacto.getEmail());
        }
        contacto.setId(null);
        contacto.setFechaRegistro(null);
        Contacto creado = repository.save(contacto);
        bitacora.registrar(AccionBitacora.CREAR, creado, "Email: " + creado.getEmail());
        return creado;
    }

    @Transactional
    public Contacto actualizar(Long id, Contacto datos) {
        Contacto contacto = obtener(id);
        if (repository.existsByEmailIgnoreCaseAndIdNot(datos.getEmail(), id)) {
            throw new ConflictoException("Ya existe otro contacto con el email " + datos.getEmail());
        }
        List<String> cambios = new ArrayList<>();
        comparar(cambios, "Nombre", contacto.getNombre(), datos.getNombre());
        comparar(cambios, "Apellido", contacto.getApellido(), datos.getApellido());
        comparar(cambios, "Email", contacto.getEmail(), datos.getEmail());
        comparar(cambios, "Teléfono", contacto.getTelefono(), datos.getTelefono());
        comparar(cambios, "Organización", contacto.getOrganizacion(), datos.getOrganizacion());

        contacto.setNombre(datos.getNombre());
        contacto.setApellido(datos.getApellido());
        contacto.setEmail(datos.getEmail());
        contacto.setTelefono(datos.getTelefono());
        contacto.setOrganizacion(datos.getOrganizacion());
        Contacto actualizado = repository.save(contacto);

        if (!cambios.isEmpty()) {
            bitacora.registrar(AccionBitacora.ACTUALIZAR, actualizado, String.join("\n", cambios));
        }
        return actualizado;
    }

    @Transactional
    public void eliminar(Long id) {
        Contacto contacto = obtener(id);
        repository.delete(contacto);
        bitacora.registrar(AccionBitacora.ELIMINAR, contacto, "Email: " + contacto.getEmail());
    }

    private static void comparar(List<String> cambios, String campo, String antes, String despues) {
        String a = vacioANulo(antes);
        String d = vacioANulo(despues);
        if (!Objects.equals(a, d)) {
            cambios.add(campo + ": " + (a == null ? "—" : a) + " → " + (d == null ? "—" : d));
        }
    }

    private static String vacioANulo(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
