# ParkControl - Sistema de Gestión de Estacionamientos

## 1. Introducción

ParkControl es una aplicación web orientada a la gestión eficiente de estacionamientos en condominios. El sistema permite registrar accesos vehiculares, administrar espacios disponibles y llevar un control detallado de residentes y visitantes, mejorando la seguridad y reduciendo la gestión manual.

---

## 2. Objetivos

### Objetivo general
Desarrollar una plataforma que optimice el control de accesos y la administración de espacios de estacionamiento en entornos residenciales.

### Objetivos específicos
- Registrar entradas y salidas de vehículos en tiempo real
- Visualizar el estado de ocupación del estacionamiento
- Gestionar información de residentes y visitantes
- Proporcionar un historial de movimientos
- Facilitar la búsqueda de vehículos por distintos criterios

---

## 3. Alcance

El sistema está enfocado en el uso por parte de personal de seguridad y administradores de condominios. El frontend se conecta a un backend desplegado en Render para la gestión de datos reales.

---

## 4. Funcionalidades

- Mapa interactivo del estacionamiento con estados en tiempo real
- Registro de entradas y salidas de vehículos con cámara OCR
- Panel de estancias activas con registro de salida
- Consulta de historial de accesos con filtros y exportación PDF/Excel
- Gestión de vehículos y residentes
- Notificaciones en tiempo real
- Visualización gráfica de ocupación

---

## 5. Arquitectura del Sistema

La aplicación sigue una arquitectura modular basada en componentes, organizada en capas:

- **Capa de presentación:** componentes y páginas bajo `src/components/parking/`
- **Capa de lógica:** servicios API, hooks personalizados y utilidades
- **Capa de datos:** conexión a backend REST desplegado en Render

---

## 6. Tecnologías Utilizadas

### Frontend
- React 19 con Vite 8
- Tailwind CSS 4
- React Router DOM 7
- Lucide React (iconos)
- Material Symbols (iconos adicionales)
- date-fns (manejo de fechas)
- Tesseract.js (OCR para lectura de placas)
- jsPDF + jspdf-autotable (exportación PDF)
- SheetJS / XLSX (exportación Excel)

---

## 7. Estructura del Proyecto

```bash
ParkingRepositorio-Frontend/
├── public/                       # Archivos públicos (favicon, íconos)
├── src/
│   ├── assets/                   # Recursos estáticos (imágenes, íconos)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Sidebar.jsx       # Barra lateral de navegación
│   │   │   └── Topbar.jsx        # Barra superior con notificaciones
│   │   └── parking/              # Módulo de estacionamiento
│   │       ├── ParkingLayout.jsx # Layout ligero del módulo
│   │       ├── assets/           # Recursos del módulo
│   │       ├── cards/
│   │       │   └── OccupancyCard.jsx
│   │       ├── components/
│   │       │   ├── AccessTable.jsx
│   │       │   ├── ActiveStays.jsx
│   │       │   ├── CameraPanel.jsx
│   │       │   ├── Filters.jsx
│   │       │   ├── Header.jsx
│   │       │   ├── Pagination.jsx
│   │       │   ├── StatsCards.jsx
│   │       │   ├── VehicleEntry.jsx
│   │       │   ├── VehicleModal.jsx
│   │       │   ├── VehicleTable.jsx
│   │       │   └── parking/
│   │       │       ├── cards/OccupancyCard.jsx
│   │       │       ├── details/
│   │       │       │   ├── DetailsBottomSheet.jsx
│   │       │       │   └── ParkingDetails.jsx
│   │       │       ├── grid/
│   │       │       │   ├── ParkingGrid.jsx
│   │       │       │   └── ParkingSpot.jsx
│   │       │       └── modals/
│   │       │           ├── MaintenanceModal.jsx
│   │       │           └── ReassignModal.jsx
│   │       ├── context/
│   │       │   └── ParkingContext.jsx
│   │       ├── data/
│   │       │   ├── mockData.js
│   │       │   └── parkingState.js
│   │       ├── details/          # (stale copies)
│   │       ├── grid/             # (stale copies)
│   │       ├── hooks/
│   │       │   ├── UseParkingSelection.jsx
│   │       │   └── useLocalStorage.js
│   │       ├── modals/           # (stale copies)
│   │       └── pages/
│   │           ├── EntryExitPage.jsx
│   │           ├── HistoryPage.jsx
│   │           ├── ParkingMapPage.jsx
│   │           └── ResidentsPage.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── services/
│   │   └── parkingService.js     # Capa de comunicación con el gateway
│   ├── utils/
│   │   └── pagination.js         # Utilidad de paginación
│   ├── App.jsx                   # Componente raíz con rutas
│   ├── main.jsx                  # Punto de entrada
│   └── index.css                 # Estilos globales + tema Tailwind
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
└── vite.config.js
```

---

## 8. Instalación

### 1. Clonar el repositorio:
```bash
git clone https://github.com/ProyectoGrupo4-Herramientas/ParkingRepositorio-Frontend.git
cd ParkingRepositorio-Frontend
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Ejecutar la aplicación:
```bash
npm run dev
```

### 4. Acceder desde el navegador:
```
http://localhost:5173
```

## Despliegue en la Nube

La aplicación se encuentra desplegada en Vercel.

Acceso: https://parkingrepositoriofrontend-3n5pxphpr-danielwavs-projects.vercel.app

---

## 9. Uso del Sistema

1. **Mapa de Estacionamiento** — Visualiza la ocupación en tiempo real por condominio y torre. Toca un espacio para ver detalles, reasignar o marcar mantenimiento.
2. **Control de Acceso** — Registra entrada/salida de vehículos usando la cámara OCR o escribiendo la placa manualmente.
3. **Directorio de Residentes** — Gestiona vehículos y residentes asociados a unidades.
4. **Historial de Accesos** — Consulta, filtra y exporta a PDF/Excel el registro de movimientos.

---

## 10. Estado del Proyecto

El proyecto se encuentra en fase de desarrollo frontend con integración a un backend REST desplegado en Render. El frontend se conecta al gateway para la gestión de datos reales de vehículos, estacionamientos y accesos.
