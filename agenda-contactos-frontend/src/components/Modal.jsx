import { useEffect } from 'react'
import Icon from './Icon'

export default function Modal({ titulo, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-fondo" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{titulo}</h2>
          <button className="btn-icono" onClick={onClose} aria-label="Cerrar"><Icon name="x" /></button>
        </header>
        {children}
      </div>
    </div>
  )
}
