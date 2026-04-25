import React from 'react';
import { LayoutDashboard, Shield, Users, Map, History, HelpCircle, LogOut, PlusCircle } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Panel', active: true },
    { icon: Shield, label: 'Control de Acceso', active: false },
    { icon: Users, label: 'Directorio de Residentes', active: false },
    { icon: Map, label: 'Mapa de Estacionamiento', active: false },
    { icon: History, label: 'Historial de Acceso', active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">ParkControl</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">Gestión Urbana</p>
      </div>

      <div className="px-4 mb-6">
        <button className="w-full bg-slate-950 text-white flex items-center justify-center py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          Registrar Nuevo Vehículo
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={clsx(
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group",
              item.active 
                ? "bg-slate-100 text-slate-900 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-slate-900 before:rounded-r"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={clsx("w-5 h-5 mr-3", item.active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600")} />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <a href="#" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-500 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <HelpCircle className="w-5 h-5 mr-3 text-slate-400" />
          Soporte
        </a>
        <a href="#" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-500 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <LogOut className="w-5 h-5 mr-3 text-slate-400" />
          Cerrar Sesión
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
