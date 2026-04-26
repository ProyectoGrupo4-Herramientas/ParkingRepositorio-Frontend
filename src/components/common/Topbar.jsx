import { useState } from "react";

export default function Topbar({ onMenuOpen }) {
  const [search, setSearch] = useState("");

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-16 z-40 border-b border-slate-200 bg-white flex items-center px-4 md:px-6 gap-3">

      <button onClick={onMenuOpen} className="md:hidden text-slate-500 hover:text-slate-900 flex-shrink-0">
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>menu</span>
      </button>

      {/* BUSQUEDA */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-0 max-w-xs">
        <span className="material-symbols-outlined text-slate-400 flex-shrink-0" style={{ fontSize: 18 }}>search</span>
        <input
          className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 min-w-0"
          placeholder="Buscar placas, unidades..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1" />

      {/* EMERGENCIA */}
      <button className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors flex-shrink-0">
        <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 16 }}>warning</span>
        <span className="hidden sm:inline whitespace-nowrap">Bloqueo de Emergencia</span>
      </button>

      {/* ICONS */}
      <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 pl-3 flex-shrink-0">
        <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <button className="text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
          U
        </div>
      </div>

    </header>
  );
}