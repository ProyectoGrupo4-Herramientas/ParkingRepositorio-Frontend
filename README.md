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

El sistema está enfocado en el uso por parte de personal de seguridad y administradores de condominios. Actualmente, el frontend funciona con datos simulados, permitiendo validar la lógica y la interfaz de usuario. La integración con backend puede ser incorporada posteriormente.

---

## 4. Funcionalidades

- Visualización del estado del estacionamiento  
- Registro de entradas y salidas de vehículos  
- Consulta de historial de accesos  
- Búsqueda de vehículos por placa o propietario  
- Gestión de residentes  
- Visualización gráfica de ocupación y actividad reciente  

---

## 5. Arquitectura del Sistema

La aplicación sigue una arquitectura modular basada en componentes, organizada en capas que separan la lógica de presentación, la lógica de negocio y la gestión de datos.

- Capa de presentación: componentes y páginas desarrolladas en React  
- Capa de lógica: servicios, hooks personalizados y utilidades  
- Capa de datos: archivos mock que simulan el comportamiento del backend  

---

## 6. Tecnologías Utilizadas

### Frontend
- React con Vite  
- Tailwind CSS  
- Lucide React  
- Node.js   

---

## 7. Estructura del Proyecto

```bash
ParkingRepositorio-Frontend/
│── public/                  # Archivos públicos (favicon, íconos, etc.)
│
│── src/
│   │── assets/              # Recursos estáticos (imágenes, íconos)
│   │
│   │── components/          # Componentes reutilizables de la interfaz
│   │   ├── Header.jsx
│   │   ├── VehicleTable.jsx
│   │   ├── VehicleModal.jsx
│   │   ├── AccessTable.jsx
│   │   ├── StatsCards.jsx
│   │   ├── StatCard.jsx
│   │   ├── Filters.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   ├── QuickActions.jsx
│   │   ├── RecentActivity.jsx
│   │   ├── ActiveStays.jsx
│   │   ├── VolumeChart.jsx
│   │   └── VehicleEntry.jsx
│
│   │── pages/               # Páginas principales del sistema
│   │   ├── DashboardPage.jsx
│   │   ├── EntryExitPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── ParkingMapPage.jsx
│   │   └── ResidentsPage.jsx
│
│   │── layouts/             # Plantillas de diseño (layouts)
│   │   └── MainLayout.jsx
│
│   │── hooks/               # Hooks personalizados
│   │   ├── useLocalStorage.js
│   │   └── useParkingSelection.jsx
│
│   │── services/            # Servicios y lógica de negocio
│   │   └── parkingService.js
│
│   │── data/                # Datos simulados (mock)
│   │   ├── mockData.js
│   │   └── initialData.js
│
│   │── utils/               # Funciones auxiliares
│   │   └── localStorage.js
│
│   │── App.jsx              # Componente raíz
│   │── main.jsx             # Punto de entrada de la aplicación
│   │── index.css            # Estilos globales
│   │── data.js              # Datos adicionales
│
│── eslint.config.js         # Configuración de ESLint
│── index.html               # Documento HTML principal
│── package-lock.json        # Versiones exactas de dependencias
│── package.json             # Dependencias y scripts
│── postcss.config.js        # Configuración de PostCSS / Tailwind
│── vite.config.js           # Configuración de Vite
```
---

## Organización del Código

El proyecto sigue una arquitectura modular basada en componentes, donde:

- `components/` contiene elementos reutilizables de la interfaz  
- `pages/` define las vistas principales del sistema  
- `services/` centraliza la lógica de negocio y acceso a datos  
- `hooks/` encapsula lógica reutilizable mediante hooks personalizados  
- `data/` simula la persistencia de datos mediante archivos mock  

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
```bash
http://localhost:5173
```
---

# 9. Uso del Sistema

El flujo principal de uso es el siguiente:
1. Registrar la entrada de un vehículo
2. Verificar disponibilidad de espacios
3. Gestionar residentes o visitantes
4. Consultar historial de movimientos
5. Registrar la salida del vehículo
---

# 10. Estado del Proyecto
El proyecto se encuentra en fase de desarrollo frontend. Actualmente utiliza datos simulados para representar la funcionalidad del sistema.
La integración con un backend y una base de datos será implementada en una siguiente entrega del proyecto.
