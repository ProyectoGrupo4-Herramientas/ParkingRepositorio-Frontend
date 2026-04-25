import React from 'react';
import { Search, AlertTriangle, Bell, Settings, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-50">
      <div className="flex-1 max-w-2xl flex items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
            placeholder="Buscar matrículas, residentes o unidades..."
          />
        </div>
        
        <button className="ml-4 flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Bloqueo de Emergencia
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;
