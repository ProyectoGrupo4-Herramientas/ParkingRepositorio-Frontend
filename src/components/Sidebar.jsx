export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-screen w-[260px] border-r border-slate-200 bg-white z-50 flex flex-col py-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_parking</span>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 font-display-lg">ParkControl</h1>
          <p className="font-label-md text-secondary">Gestión Urbana</p>
        </div>
      </div>
      <div className="px-4 mb-6">
        <button className="w-full bg-primary text-on-primary py-3 px-4 rounded font-label-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors">
          <span className="material-symbols-outlined text-sm">add_circle</span> Registrar Nuevo Vehículo
        </button>
      </div>
      <ul className="flex-1 space-y-1">
        <li>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] font-body-sm" href="#">
            <span className="material-symbols-outlined">dashboard</span> Panel de Control
          </a>
        </li>
        <li>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-900 bg-slate-100 font-semibold border-r-2 border-slate-900 hover:bg-slate-200 transition-all duration-200 active:scale-[0.98] font-body-sm" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sensor_occupied</span> Control de Acceso
          </a>
        </li>
        <li>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] font-body-sm" href="#">
            <span className="material-symbols-outlined">group</span> Directorio de Residentes
          </a>
        </li>
        <li>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] font-body-sm" href="#">
            <span className="material-symbols-outlined">grid_view</span> Mapa de Estacionamiento
          </a>
        </li>
        <li>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] font-body-sm" href="#">
            <span className="material-symbols-outlined">history</span> Historial de Accesos
          </a>
        </li>
      </ul>
      <ul className="mt-auto space-y-1">
        <li>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] font-body-sm" href="#">
            <span className="material-symbols-outlined">help</span> Soporte
          </a>
        </li>
        <li>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] font-body-sm" href="#">
            <span className="material-symbols-outlined">logout</span> Cerrar Sesión
          </a>
        </li>
      </ul>
    </nav>
  );
}
