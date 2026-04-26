export default function ActiveStays() {
  return (
    <section className="w-[400px] flex flex-col gap-6">
      <div className="bg-white border border-slate-200 rounded-lg flex flex-col h-[calc(100vh-128px)] shadow-sm">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
          <h3 className="font-semibold text-slate-800">Estancias Activas</h3>
          <span className="bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded text-xs">42 Vehículos</span>
        </div>
        <div className="p-3 border-b border-slate-200 bg-white">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input className="w-full bg-slate-50 border border-slate-200 rounded pl-9 pr-3 py-2 text-sm text-slate-800 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:outline-none" placeholder="Filter plates..." type="text"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* List Item 1 */}
          <div className="p-3 border border-slate-200 rounded bg-white hover:bg-slate-50 transition-colors group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-indigo-500">directions_car</span>
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-sm">XYZ-9876</div>
                <div className="font-medium text-slate-500 text-[10px]">Visitante • 2h 15m</div>
              </div>
            </div>
            <button className="text-slate-800 hover:bg-slate-800 hover:text-white border border-slate-800 px-3 py-1.5 rounded font-bold text-xs transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">Registrar Salida</button>
          </div>
          {/* List Item 2 */}
          <div className="p-3 border border-slate-200 rounded bg-white hover:bg-slate-50 transition-colors group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-teal-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-teal-600">directions_car</span>
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-sm">DEF-5678</div>
                <div className="font-medium text-teal-600 text-[10px]">Residente • L1-12</div>
              </div>
            </div>
            <button className="text-slate-800 hover:bg-slate-800 hover:text-white border border-slate-800 px-3 py-1.5 rounded font-bold text-xs transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">Registrar Salida</button>
          </div>
          {/* List Item 3 */}
          <div className="p-3 border border-slate-200 rounded bg-white hover:bg-slate-50 transition-colors group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500">local_shipping</span>
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-sm">TRK-112</div>
                <div className="font-medium text-red-500 text-[10px]">Entrega • 45m</div>
              </div>
            </div>
            <button className="text-slate-800 hover:bg-slate-800 hover:text-white border border-slate-800 px-3 py-1.5 rounded font-bold text-xs transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">Registrar Salida</button>
          </div>
        </div>
      </div>
    </section>
  );
}
