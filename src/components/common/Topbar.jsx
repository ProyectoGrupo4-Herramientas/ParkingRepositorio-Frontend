import React from "react";

export default function Topbar({ onMenuOpen}) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-16 z-40 border-b border-slate-200 bg-white flex items-center px-4 md:px-6 gap-3">
      <button
        onClick={onMenuOpen}
        className="md:hidden text-slate-500 hover:text-slate-900 flex-shrink-0"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
          menu
        </span>
      </button>


      <div className="flex-1" />

      <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
        <button className="relative text-slate-500 hover:text-slate-900">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            notifications
          </span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
