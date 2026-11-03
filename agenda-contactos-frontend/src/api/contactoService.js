import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const contactoService = {
  listar: (q) => api.get('/contactos', { params: q ? { q } : {} }).then((r) => r.data),
  obtener: (id) => api.get(`/contactos/${id}`).then((r) => r.data),
  crear: (contacto) => api.post('/contactos', contacto).then((r) => r.data),
  actualizar: (id, contacto) => api.put(`/contactos/${id}`, contacto).then((r) => r.data),
  eliminar: (id) => api.delete(`/contactos/${id}`),
}

export const bitacoraService = {
  listar: (accion) => api.get('/bitacora', { params: accion ? { accion } : {} }).then((r) => r.data),
}

export const informeService = {
  resumen: () => api.get('/informes/resumen').then((r) => r.data),
  urlCsvContactos: '/api/informes/contactos.csv',
}

/** Convierte un error de Axios en { mensaje, errores } legible. */
export function leerError(error) {
  const data = error.response?.data
  if (data?.mensaje) return { mensaje: data.mensaje, errores: data.errores ?? {} }
  if (!error.response) return { mensaje: 'No se pudo conectar con el servidor', errores: {} }
  return { mensaje: 'Ocurrió un error inesperado', errores: {} }
}
