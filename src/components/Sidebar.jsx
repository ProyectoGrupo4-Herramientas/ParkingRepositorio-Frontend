import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Map, 
  History, 
  HelpCircle, 
  LogOut,
  Plus
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">ParkControl</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Urban Management</p>
      </div>

      <div className="px-4 mb-6">
        <button className="w-full bg-black text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 font-medium text-sm hover:bg-slate-800 transition-colors shadow-xs">
          <Plus size={16} />
          Registrar Nuevo Vehículo
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <NavItem icon={<LayoutDashboard size={20} />} label="Panel de Control" />
        <NavItem icon={<ShieldCheck size={20} />} label="Control de Acceso" />
        <NavItem icon={<Users size={20} />} label="Residente" />
        <NavItem icon={<Map size={20} />} label="Mapa de Estacionamiento" />
        <NavItem icon={<History size={20} />} label="Historial de Accesos" active />
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <NavItem icon={<HelpCircle size={20} />} label="Soporte" secondary />
        <NavItem icon={<LogOut size={20} />} label="Cerrar Sesión" secondary />
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center px-3 cursor-pointer hover:bg-slate-50 rounded-lg py-2 transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
             {/* Simulating an avatar */}
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e2e8f0" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active, secondary }) => {
  return (
    <a 
      href="#" 
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
        ${active 
          ? 'bg-slate-100 text-slate-900 font-semibold relative' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
        }
        ${secondary && 'text-slate-500 hover:text-slate-700'}
      `}
    >
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-r-md"></div>
      )}
      <span className={`${active ? 'text-slate-900' : 'text-slate-400'}`}>
        {icon}
      </span>
      {label}
    </a>
  );
};

export default Sidebar;
