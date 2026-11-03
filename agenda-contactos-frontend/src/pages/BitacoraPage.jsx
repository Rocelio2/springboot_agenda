import { useEffect, useState } from 'react'
import { bitacoraService, leerError } from '../api/contactoService'
import Icon from '../components/Icon'
import { formatoFechaHora, haceCuanto } from '../utils/formato'

const FILTROS = [
  { clave: '', etiqueta: 'Todo' },
  { clave: 'CREAR', etiqueta: 'Creaciones' },
  { clave: 'ACTUALIZAR', etiqueta: 'Actualizaciones' },
  { clave: 'ELIMINAR', etiqueta: 'Eliminaciones' },
]

const ACCION = {
  CREAR: { icono: 'plus', verbo: 'fue creado' },
  ACTUALIZAR: { icono: 'edit', verbo: 'fue actualizado' },
  ELIMINAR: { icono: 'trash', verbo: 'fue eliminado' },
}

export default function BitacoraPage() {
  const [filtro, setFiltro] = useState('')
  const [registros, setRegistros] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true
    bitacoraService.listar(filtro)
      .then((datos) => { if (vigente) { setRegistros(datos); setError('') } })
      .catch((err) => vigente && setError(leerError(err).mensaje))
    return () => { vigente = false }
  }, [filtro])

  return (
    <>
      <header className="cabecera">
        <div>
          <h1>Bitácora</h1>
          <p className="texto-suave">Historial de cambios sobre los contactos</p>
        </div>
      </header>

      <div className="segmentado" role="tablist">
        {FILTROS.map((f) => (
          <button
            key={f.clave} role="tab" aria-selected={filtro === f.clave}
            className={filtro === f.clave ? 'activo' : ''} onClick={() => setFiltro(f.clave)}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {error && <p className="alerta">{error}</p>}
      {!registros && !error && <div className="estado texto-suave">Cargando…</div>}
      {registros?.length === 0 && (
        <div className="estado">
          <span className="estado-icono"><Icon name="history" size={26} /></span>
          <p className="texto-suave">No hay movimientos para este filtro.</p>
        </div>
      )}

      {registros?.length > 0 && (
        <ol className="tarjeta linea-tiempo">
          {registros.map((r) => {
            const a = ACCION[r.accion]
            return (
              <li key={r.id}>
                <span className={`accion-icono ${r.accion.toLowerCase()}`}><Icon name={a.icono} size={16} /></span>
                <div className="evento">
                  <div className="evento-cabecera">
                    <p>
                      <strong>{r.contactoNombre}</strong> {a.verbo}
                      <span className="texto-suave"> · #{r.contactoId}</span>
                    </p>
                    <time dateTime={r.fecha} title={formatoFechaHora(r.fecha)}>{haceCuanto(r.fecha)}</time>
                  </div>
                  {r.detalle && (
                    <ul className="cambios">
                      {r.detalle.split('\n').map((linea) => <li key={linea}>{linea}</li>)}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </>
  )
}
