import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Shield,
  Users,
  Map,
  History,
  HelpCircle,
  LogOut,
  PlusCircle,
} from "lucide-react";

const navLinks = [
  { to: "/", icon: LayoutDashboard, label: "Panel" },
  { to: "/access", icon: Shield, label: "Control de Acceso" },
  { to: "/residents", icon: Users, label: "Directorio de Residentes" },
  { to: "/parking", icon: Map, label: "Mapa de Estacionamiento" },
  { to: "/history", icon: History, label: "Historial de Acceso" },
];

export default function Sidebar({ open, onClose, onOpenModal }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-200
          flex flex-col py-6 z-50 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* logo */}
        <div className="px-6 mb-8">
          <h1 className="text-lg font-black text-slate-900">ParkControl</h1>
          <p className="text-xs text-slate-400">Gestión Urbana</p>
        </div>

        {/* button */}
        <div className="px-4 mb-6">
          <button
            onClick={onOpenModal}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-700"
          >
            <PlusCircle size={18} />
            Registrar Nuevo Vehículo
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 flex flex-col gap-1 px-2">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* bottom */}
        <div className="px-2 mt-4 flex flex-col gap-1">

          <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg">
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
