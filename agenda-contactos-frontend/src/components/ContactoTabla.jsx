import Icon from './Icon'
import { formatoFecha } from '../utils/formato'

const iniciales = (c) => `${c.nombre?.[0] ?? ''}${c.apellido?.[0] ?? ''}`.toUpperCase()

export default function ContactoTabla({ contactos, onEditar, onEliminar }) {
  return (
    <div className="tarjeta tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Organización</th>
            <th>Registro</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {contactos.map((c) => (
            <tr key={c.id}>
              <td>
                <div className="contacto-celda">
                  <span className="avatar">{iniciales(c)}</span>
                  <div>
                    <strong>{c.nombre} {c.apellido}</strong>
                    <span className="texto-suave">{c.email}</span>
                  </div>
                </div>
              </td>
              <td data-label="Teléfono">{c.telefono || <span className="texto-suave">—</span>}</td>
              <td data-label="Organización">{c.organizacion ? <span className="chip">{c.organizacion}</span> : <span className="texto-suave">—</span>}</td>
              <td data-label="Registro" className="texto-suave">{formatoFecha(c.fechaRegistro)}</td>
              <td className="acciones">
                <button className="btn-icono" onClick={() => onEditar(c)} title="Editar" aria-label={`Editar a ${c.nombre}`}>
                  <Icon name="edit" size={17} />
                </button>
                <button className="btn-icono peligro" onClick={() => onEliminar(c)} title="Eliminar" aria-label={`Eliminar a ${c.nombre}`}>
                  <Icon name="trash" size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
