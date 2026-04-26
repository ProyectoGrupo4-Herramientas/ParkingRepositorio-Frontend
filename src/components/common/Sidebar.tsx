import { NavLink } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { to: "/dashboard",   icon: "grid_view",       label: "Tablero" },
  { to: "/access",      icon: "sensor_occupied",  label: "Control de Acceso" },
  { to: "/residents",   icon: "group",            label: "Directorio de Residentes" },
  { to: "/parking-map", icon: "local_parking",    label: "Mapa de Estacionamiento" },
  { to: "/history",     icon: "history",          label: "Historial de Acceso" },
];

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-200
        flex flex-col py-6 z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>

        <button onClick={onClose} className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-slate-700">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
        </button>

        {/* HEADER */}
        <div className="px-6 mb-8">
          <h1 className="text-lg font-black tracking-tight text-slate-900">ParkControl</h1>
          <p className="text-xs text-slate-400 mt-0.5">Urban Management</p>
        </div>

        {/* BUTTON */}
        <div className="px-4 mb-6">
          <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Registrar Nuevo Vehículo
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto">
          {navLinks.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}
              `}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="flex flex-col gap-0.5 px-2 mt-4">
          <NavLink
            to="/support"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>help_outline</span>
            Soporte
          </NavLink>
          <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            Cerrar Sesión
          </button>
        </div>

      </aside>
    </>
  );
}