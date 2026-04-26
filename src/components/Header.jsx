import React from 'react';
import { Search, Bell, Settings, OctagonAlert } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between flex-shrink-0">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm transition-colors"
            placeholder="Buscar placas, unidades o nombres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="ml-4 flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <button className="relative text-gray-400 hover:text-gray-500 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          <button className="text-gray-400 hover:text-gray-500 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200"></div>

        <button className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors border border-red-100">
          <OctagonAlert className="h-4 w-4" />
          <span className="text-sm font-medium">Bloqueo de Emergencia</span>
        </button>

        <div className="w-px h-6 bg-gray-200"></div>

        <button className="flex items-center">
          <img
            className="h-8 w-8 rounded-full border border-gray-200"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
