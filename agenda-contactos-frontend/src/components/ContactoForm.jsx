import { useState } from 'react'
import { contactoService, leerError } from '../api/contactoService'

const VACIO = { nombre: '', apellido: '', email: '', telefono: '', organizacion: '' }

export default function ContactoForm({ contacto, onGuardado, onCancelar }) {
  const [form, setForm] = useState(() => ({ ...VACIO, ...contacto }))
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)

  const editando = Boolean(contacto?.id)

  const cambiar = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrores((er) => ({ ...er, [name]: undefined }))
  }

  const enviar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')
    try {
      const guardado = editando
        ? await contactoService.actualizar(contacto.id, form)
        : await contactoService.crear(form)
      onGuardado(guardado, editando)
    } catch (err) {
      const { mensaje, errores } = leerError(err)
      setMensaje(mensaje)
      setErrores(errores)
    } finally {
      setGuardando(false)
    }
  }

  const campo = (name, label, props = {}) => (
    <label className={`campo ${errores[name] ? 'con-error' : ''}`}>
      <span>{label}</span>
      <input name={name} value={form[name] ?? ''} onChange={cambiar} {...props} />
      {errores[name] && <small>{errores[name]}</small>}
    </label>
  )

  return (
    <form className="form" onSubmit={enviar} noValidate>
      {mensaje && <div className="alerta">{mensaje}</div>}
      <div className="fila">
        {campo('nombre', 'Nombre *', { autoFocus: true, maxLength: 60 })}
        {campo('apellido', 'Apellido *', { maxLength: 60 })}
      </div>
      {campo('email', 'Email *', { type: 'email', maxLength: 120 })}
      <div className="fila">
        {campo('telefono', 'Teléfono', { maxLength: 20, placeholder: '809-000-0000' })}
        {campo('organizacion', 'Organización', { maxLength: 100 })}
      </div>
      <footer className="form-acciones">
        <button type="button" className="btn btn-secundario" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primario" disabled={guardando}>
          {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear contacto'}
        </button>
      </footer>
    </form>
  )
}
