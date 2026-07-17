# ParkControl - Frontend

Aplicación React para la gestión de estacionamientos en condominios. Comunicación con el backend BFF a través de API REST.

## Tecnologías

- React 19
- Vite 8
- Tailwind CSS 4
- React Router
- date-fns
- Lucide React (iconos)

## Rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | DashboardPage | Panel principal con métricas |
| `/access` | EntryExitPage | Control de Acceso |
| `/parking` | ParkingMapPage | Mapa de estacionamiento |
| `/residents` | ResidentsPage | Directorio de residentes |
| `/history` | HistoryPage | Historial de acceso |

## Arquitectura Frontend

```
Pages → Hooks → Context → parkingService → Gateway (BFF)
                           ↓
                   Componentes UI
```

- `ParkingContext`: Estado global (vehículos, estacionamientos, propietarios, préstamos)
- `parkingService`: Capa de comunicación HTTP con el gateway
- Componentes activos en `src/components/parking/components/parking/`

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_GATEWAY_URL` | URL del gateway (BFF) | https://parkingrepositorio-backend.onrender.com |

## Ejecución Local

```bash
VITE_GATEWAY_URL=http://localhost:8080 npm run dev
```

## Build

```bash
VITE_GATEWAY_URL=https://d21ojxpt18lomy.cloudfront.net npm run build
```

Los archivos estáticos se generan en `dist/`.
