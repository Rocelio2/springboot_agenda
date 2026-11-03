const LOCALE = 'es-DO'

/** "2026-10-29" -> "29 oct 2026" */
export const formatoFecha = (iso) =>
  iso
    ? new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

/** "2026-10-29T17:10:28" -> "29 oct 2026, 5:10 p. m." */
export const formatoFechaHora = (iso) =>
  new Date(iso).toLocaleString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })

/** "2026-05" -> "may" */
export const nombreMes = (yyyyMm, largo = false) =>
  new Date(`${yyyyMm}-01T00:00:00`).toLocaleDateString(LOCALE, largo ? { month: 'long', year: 'numeric' } : { month: 'short' })

const relativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
const UNIDADES = [
  ['year', 31536000], ['month', 2592000], ['week', 604800],
  ['day', 86400], ['hour', 3600], ['minute', 60],
]

/** "hace 5 minutos", "ayer", "hace 3 meses" */
export function haceCuanto(iso) {
  const segundos = (new Date(iso).getTime() - Date.now()) / 1000
  for (const [unidad, s] of UNIDADES) {
    if (Math.abs(segundos) >= s) return relativo.format(Math.round(segundos / s), unidad)
  }
  return 'justo ahora'
}
