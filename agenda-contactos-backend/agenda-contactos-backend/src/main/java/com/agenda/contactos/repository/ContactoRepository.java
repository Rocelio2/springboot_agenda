package com.agenda.contactos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agenda.contactos.model.Contacto;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

    List<Contacto> findAllByOrderByIdDesc();

    @Query("""
            SELECT c FROM Contacto c
            WHERE LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.apellido) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.organizacion) LIKE LOWER(CONCAT('%', :q, '%'))
            ORDER BY c.id DESC
            """)
    List<Contacto> buscar(@Param("q") String q);
}
