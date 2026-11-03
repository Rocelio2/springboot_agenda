import { useEffect, useState } from 'react'
import Icon from './components/Icon'
import BitacoraPage from './pages/BitacoraPage'
import ContactosPage from './pages/ContactosPage'
import InformesPage from './pages/InformesPage'

const SECCIONES = [
  { id: 'contactos', etiqueta: 'Contactos', icono: 'users' },
  { id: 'informes', etiqueta: 'Informes', icono: 'chart' },
  { id: 'bitacora', etiqueta: 'Bitácora', icono: 'history' },
]

// Navegación simple con el hash de la URL (#/informes)
const seccionActual = () => {
  const id = window.location.hash.replace('#/', '')
  return SECCIONES.some((s) => s.id === id) ? id : 'contactos'
}

// Preferencia del menú fijo; localStorage puede no estar disponible
const leerMenuFijo = () => {
  try { return localStorage.getItem('menu-fijo') === '1' } catch { return false }
}

export default function App() {
  const [seccion, setSeccion] = useState(seccionActual)
  const [menuFijo, setMenuFijo] = useState(leerMenuFijo)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const alCambiar = () => setSeccion(seccionActual())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const alternarMenu = () => {
    const valor = !menuFijo
    setMenuFijo(valor)
    try { localStorage.setItem('menu-fijo', valor ? '1' : '0') } catch { /* sin almacenamiento */ }
  }

  const irA = (id) => { window.location.hash = `/${id}` }

  return (
    <div className={`layout ${menuFijo ? 'menu-fijo' : ''}`}>
      <aside className="sidebar">
        <div className="marca">
          <span className="marca-logo">GC</span>
          <span className="etiqueta">Agenda <small>de contactos</small></span>
        </div>

        <nav>
          {SECCIONES.map((s) => (
            <a
              key={s.id} href={`#/${s.id}`} className={seccion === s.id ? 'activo' : ''}
              aria-current={seccion === s.id ? 'page' : undefined} aria-label={s.etiqueta}
            >
              <span className="nav-icono"><Icon name={s.icono} size={20} /></span>
              <span className="etiqueta">{s.etiqueta}</span>
            </a>
          ))}
        </nav>

        <button className="sidebar-toggle" onClick={alternarMenu} aria-label={menuFijo ? 'Contraer menú' : 'Fijar menú abierto'}>
          <span className="nav-icono"><Icon name={menuFijo ? 'contraer' : 'expandir'} size={18} /></span>
          <span className="etiqueta">{menuFijo ? 'Contraer' : 'Fijar abierto'}</span>
        </button>
      </aside>

      <main className="contenido" key={seccion}>
        {seccion === 'contactos' && <ContactosPage notificar={setToast} />}
        {seccion === 'informes' && <InformesPage irA={irA} />}
        {seccion === 'bitacora' && <BitacoraPage />}
      </main>

      {toast && (
        <div className="toast" role="status"><Icon name="check" size={16} /> {toast}</div>
      )}
    </div>
  )
}
