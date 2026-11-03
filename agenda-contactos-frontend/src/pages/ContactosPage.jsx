import { useCallback, useEffect, useState } from 'react'
import { contactoService, leerError } from '../api/contactoService'
import ContactoForm from '../components/ContactoForm'
import ContactoTabla from '../components/ContactoTabla'
import Icon from '../components/Icon'
import Modal from '../components/Modal'

export default function ContactosPage({ notificar }) {
  const [contactos, setContactos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [formContacto, setFormContacto] = useState(null) // {} = nuevo, objeto = editar
  const [porEliminar, setPorEliminar] = useState(null)

  const cargar = useCallback(async (q) => {
    setCargando(true)
    try {
      setContactos(await contactoService.listar(q))
      setError('')
    } catch (err) {
      setError(leerError(err).mensaje)
    } finally {
      setCargando(false)
    }
  }, [])

  // Búsqueda con un pequeño retardo para no llamar al API en cada tecla
  useEffect(() => {
    const t = setTimeout(() => cargar(busqueda), 250)
    return () => clearTimeout(t)
  }, [busqueda, cargar])

  const cerrarForm = useCallback(() => setFormContacto(null), [])
  const cerrarEliminar = useCallback(() => setPorEliminar(null), [])

  const alGuardar = (contacto, editado) => {
    setFormContacto(null)
    notificar(editado ? 'Contacto actualizado' : 'Contacto creado')
    cargar(busqueda)
  }

  const confirmarEliminar = async () => {
    try {
      await contactoService.eliminar(porEliminar.id)
      notificar('Contacto eliminado')
      cargar(busqueda)
    } catch (err) {
      notificar(leerError(err).mensaje)
    } finally {
      setPorEliminar(null)
    }
  }

  return (
    <>
      <header className="cabecera">
        <div>
          <h1>Contactos</h1>
          <p className="texto-suave">
            {contactos.length} {contactos.length === 1 ? 'contacto' : 'contactos'}
            {busqueda ? ' encontrados' : ' registrados'}
          </p>
        </div>
        <button className="btn btn-primario" onClick={() => setFormContacto({})}>
          <Icon name="plus" size={17} /> Nuevo contacto
        </button>
      </header>

      <div className="buscador">
        <Icon name="search" />
        <input
          type="search"
          placeholder="Buscar por nombre, email u organización…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {error ? (
        <div className="estado">
          <p className="alerta">{error}</p>
          <button className="btn btn-secundario" onClick={() => cargar(busqueda)}><Icon name="refresh" size={16} /> Reintentar</button>
        </div>
      ) : cargando && contactos.length === 0 ? (
        <div className="estado texto-suave">Cargando…</div>
      ) : contactos.length === 0 ? (
        <div className="estado">
          <span className="estado-icono"><Icon name="inbox" size={26} /></span>
          <p className="texto-suave">{busqueda ? 'Ningún contacto coincide con la búsqueda.' : 'Aún no hay contactos.'}</p>
        </div>
      ) : (
        <ContactoTabla contactos={contactos} onEditar={setFormContacto} onEliminar={setPorEliminar} />
      )}

      {formContacto && (
        <Modal titulo={formContacto.id ? 'Editar contacto' : 'Nuevo contacto'} onClose={cerrarForm}>
          <ContactoForm contacto={formContacto} onGuardado={alGuardar} onCancelar={cerrarForm} />
        </Modal>
      )}

      {porEliminar && (
        <Modal titulo="Eliminar contacto" onClose={cerrarEliminar}>
          <p className="confirmar">
            ¿Seguro que deseas eliminar a <strong>{porEliminar.nombre} {porEliminar.apellido}</strong>?
            La acción quedará registrada en la bitácora.
          </p>
          <footer className="form-acciones">
            <button className="btn btn-secundario" onClick={cerrarEliminar}>Cancelar</button>
            <button className="btn btn-peligro" onClick={confirmarEliminar}><Icon name="trash" size={16} /> Eliminar</button>
          </footer>
        </Modal>
      )}
    </>
  )
}
