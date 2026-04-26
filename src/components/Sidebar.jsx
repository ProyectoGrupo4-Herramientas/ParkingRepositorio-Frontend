import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Map, 
  History, 
  Plus,
  HelpCircle,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ onOpenModal }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Panel de Control', active: false },
    { icon: ShieldCheck, label: 'Control de Acceso', active: false },
    { icon: Users, label: 'Directorio de Residentes', active: true },
    { icon: Map, label: 'Mapa de Estacionamiento', active: false },
    { icon: History, label: 'Historial de Accesos', active: false },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Soporte' },
    { icon: LogOut, label: 'Cerrar Sesión' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">ParkControl</h1>
        <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Urban Management</p>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-1">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={clsx(
              'flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
              item.active 
                ? 'bg-gray-50 text-gray-900 border-l-4 border-gray-900 -ml-4 pl-7 rounded-l-none' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <item.icon className={clsx('w-5 h-5 mr-3', item.active ? 'text-gray-900' : 'text-gray-400')} />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onOpenModal}
          className="w-full bg-[#111827] text-white rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm mb-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Nuevo<br/>Vehículo
        </button>

        <div className="space-y-1">
          {bottomItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3 text-gray-400" />
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
