# Agenda de Contactos

Aplicación web para llevar una agenda de contactos: altas, ediciones, búsqueda,
un panel de estadísticas y una bitácora con los movimientos realizados.

- **Servidor:** Java 17, Spring Boot, JPA/Hibernate, base de datos SQLite
- **Interfaz:** React con Vite

## Estructura

| Carpeta | Contenido | Puerto |
|---|---|---|
| `agenda-contactos-backend/agenda-contactos-backend` | API REST (Maven) | 8081 |
| `agenda-contactos-frontend` | Interfaz web | 5173 |

## Puesta en marcha

Necesitas JDK 17+ y Node.js 20+.

Servidor (la primera vez crea `contactos.db` con datos de ejemplo):

```bash
cd agenda-contactos-backend/agenda-contactos-backend
./mvnw spring-boot:run
```

En Windows usa `mvnw.cmd spring-boot:run`.

Interfaz, en otra terminal:

```bash
cd agenda-contactos-frontend
npm install
npm run dev
```

Abre http://localhost:5173. Vite reenvía las peticiones `/api` al servidor.

## Endpoints

| Método | Ruta | Para qué sirve |
|---|---|---|
| GET | `/api/contactos` | Lista los contactos (parámetro opcional `q` para buscar) |
| GET | `/api/contactos/{id}` | Devuelve un contacto |
| POST | `/api/contactos` | Crea un contacto |
| PUT | `/api/contactos/{id}` | Modifica un contacto |
| DELETE | `/api/contactos/{id}` | Borra un contacto |
| GET | `/api/bitacora` | Últimos movimientos (filtro opcional `accion`) |
| GET | `/api/informes/resumen` | Cifras y gráficas del panel de estadísticas |
| GET | `/api/informes/contactos.csv` | Exporta la agenda en CSV |
