import { useEffect, useState } from 'react'
import { leerError, informeService } from '../api/contactoService'
import Icon from '../components/Icon'
import { nombreMes } from '../utils/formato'

function StatCard({ icono, etiqueta, valor, nota }) {
  return (
    <div className="tarjeta stat">
      <span className="stat-icono"><Icon name={icono} size={20} /></span>
      <div>
        <p className="stat-etiqueta">{etiqueta}</p>
        <p className="stat-valor">{valor}</p>
        {nota && <p className="stat-nota">{nota}</p>}
      </div>
    </div>
  )
}

/** Columnas por mes: una sola serie, etiqueta directa solo en el mes actual y tooltip al pasar el ratón. */
function GraficoMeses({ datos }) {
  const max = Math.max(1, ...datos.map((d) => d.total))
  return (
    <div className="columnas" role="img" aria-label="Contactos registrados por mes">
      {datos.map((d, i) => {
        const actual = i === datos.length - 1
        return (
          <div key={d.etiqueta} className="columna" tabIndex={0}>
            <span className="tooltip">
              <strong>{d.total}</strong> {d.total === 1 ? 'contacto' : 'contactos'} · {nombreMes(d.etiqueta, true)}
            </span>
            <div className="columna-pista">
              {actual && <span className="columna-valor">{d.total}</span>}
              <div className={`columna-barra ${d.total === 0 ? 'cero' : ''}`} style={{ height: `${(d.total / max) * 100}%` }} />
            </div>
            <span className={`columna-mes ${actual ? 'actual' : ''}`}>{nombreMes(d.etiqueta)}</span>
          </div>
        )
      })}
    </div>
  )
}

function BarrasOrganizaciones({ datos }) {
  if (datos.length === 0) return <p className="texto-suave vacio">Aún no hay contactos con organización.</p>
  const max = Math.max(...datos.map((d) => d.total))
  return (
    <ul className="barras">
      {datos.map((d) => (
        <li key={d.etiqueta} title={`${d.etiqueta}: ${d.total}`}>
          <div className="barras-fila">
            <span>{d.etiqueta}</span>
            <strong>{d.total}</strong>
          </div>
          <div className="barras-pista">
            <div className="barras-barra" style={{ width: `${(d.total / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

const ACCIONES = [
  { clave: 'CREAR', etiqueta: 'Creaciones', icono: 'plus' },
  { clave: 'ACTUALIZAR', etiqueta: 'Actualizaciones', icono: 'edit' },
  { clave: 'ELIMINAR', etiqueta: 'Eliminaciones', icono: 'trash' },
]

export default function InformesPage({ irA }) {
  const [resumen, setResumen] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    informeService.resumen().then(setResumen).catch((err) => setError(leerError(err).mensaje))
  }, [])

  const pct = resumen?.totalContactos ? Math.round((resumen.contactosConOrganizacion / resumen.totalContactos) * 100) : 0

  return (
    <>
      <header className="cabecera">
        <div>
          <h1>Informes</h1>
          <p className="texto-suave">Resumen de la cartera de contactos</p>
        </div>
        <a className="btn btn-secundario" href={informeService.urlCsvContactos} download>
          <Icon name="download" size={17} /> Exportar CSV
        </a>
      </header>

      {error && <p className="alerta">{error}</p>}
      {!resumen && !error && <div className="estado texto-suave">Cargando…</div>}

      {resumen && (
        <>
          <section className="stats">
            <StatCard icono="users" etiqueta="Total de contactos" valor={resumen.totalContactos} />
            <StatCard icono="userPlus" etiqueta="Nuevos este mes" valor={resumen.nuevosEsteMes} />
            <StatCard icono="briefcase" etiqueta="Con organización" valor={`${pct}%`} nota={`${resumen.contactosConOrganizacion} de ${resumen.totalContactos}`} />
            <StatCard icono="building" etiqueta="Organizaciones distintas" valor={resumen.totalOrganizaciones} />
          </section>

          <section className="rejilla">
            <div className="tarjeta panel ancho">
              <h3>Registros por mes</h3>
              <p className="texto-suave">Contactos nuevos en los últimos 6 meses</p>
              <GraficoMeses datos={resumen.registrosPorMes} />
            </div>

            <div className="tarjeta panel">
              <h3>Organizaciones principales</h3>
              <p className="texto-suave">Por número de contactos</p>
              <BarrasOrganizaciones datos={resumen.topOrganizaciones} />
            </div>

            <div className="tarjeta panel">
              <div className="panel-titulo">
                <div>
                  <h3>Actividad</h3>
                  <p className="texto-suave">Movimientos registrados en bitácora</p>
                </div>
                <button className="btn-enlace" onClick={() => irA('bitacora')}>Ver todo →</button>
              </div>
              <ul className="actividad">
                {ACCIONES.map((a) => (
                  <li key={a.clave}>
                    <span className={`accion-icono ${a.clave.toLowerCase()}`}><Icon name={a.icono} size={16} /></span>
                    <span>{a.etiqueta}</span>
                    <strong>{resumen.actividad[a.clave] ?? 0}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </>
  )
}
