package com.agenda.contactos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agenda.contactos.model.AccionBitacora;
import com.agenda.contactos.model.Bitacora;

public interface BitacoraRepository extends JpaRepository<Bitacora, Long> {

    List<Bitacora> findTop200ByOrderByFechaDescIdDesc();

    List<Bitacora> findTop200ByAccionOrderByFechaDescIdDesc(AccionBitacora accion);

    long countByAccion(AccionBitacora accion);
}
