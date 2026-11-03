package com.agenda.contactos.config;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.agenda.contactos.model.AccionBitacora;
import com.agenda.contactos.model.Bitacora;
import com.agenda.contactos.model.Contacto;
import com.agenda.contactos.repository.BitacoraRepository;
import com.agenda.contactos.repository.ContactoRepository;

import lombok.RequiredArgsConstructor;

/**
 * Inserta contactos de ejemplo (repartidos en los últimos meses, para que los
 * informes tengan datos) la primera vez que arranca la app.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ContactoRepository contactoRepository;
    private final BitacoraRepository bitacoraRepository;

    @Override
    public void run(String... args) {
        if (contactoRepository.count() > 0) {
            return;
        }
        LocalDate hoy = LocalDate.now();
        List<Contacto> contactos = contactoRepository.saveAll(List.of(
                contacto("Ana", "Martínez", "ana.martinez@correo.com", "809-555-0101", "Tecnosur", hoy.minusMonths(5)),
                contacto("Carlos", "Pérez", "carlos.perez@correo.com", "829-555-0202", "Grupo Caribe", hoy.minusMonths(5)),
                contacto("Lucía", "Gómez", "lucia.gomez@correo.com", "849-555-0303", null, hoy.minusMonths(4)),
                contacto("Miguel", "Santos", "miguel.santos@correo.com", "809-555-0404", "Tecnosur", hoy.minusMonths(3)),
                contacto("Sofía", "Reyes", "sofia.reyes@correo.com", "829-555-0505", "Banco Atlántico", hoy.minusMonths(3)),
                contacto("Javier", "Núñez", "javier.nunez@correo.com", null, "Grupo Caribe", hoy.minusMonths(2)),
                contacto("Valeria", "Castillo", "valeria.castillo@correo.com", "849-555-0707", "Tecnosur", hoy.minusMonths(1)),
                contacto("Andrés", "Rosario", "andres.rosario@correo.com", "809-555-0808", "Farmacia Central", hoy.minusMonths(1)),
                contacto("Camila", "Herrera", "camila.herrera@correo.com", "829-555-0909", "Banco Atlántico", hoy),
                contacto("Diego", "Almonte", "diego.almonte@correo.com", "849-555-1010", null, hoy)));

        bitacoraRepository.saveAll(contactos.stream()
                .map(c -> Bitacora.builder()
                        .accion(AccionBitacora.CREAR)
                        .contactoId(c.getId())
                        .contactoNombre(c.getNombre() + " " + c.getApellido())
                        .detalle("Email: " + c.getEmail())
                        .fecha(c.getFechaRegistro().atTime(9, 0))
                        .build())
                .toList());
    }

    private static Contacto contacto(String nombre, String apellido, String email, String telefono,
            String organizacion, LocalDate fecha) {
        return Contacto.builder().nombre(nombre).apellido(apellido).email(email)
                .telefono(telefono).organizacion(organizacion).fechaRegistro(fecha).build();
    }
}
