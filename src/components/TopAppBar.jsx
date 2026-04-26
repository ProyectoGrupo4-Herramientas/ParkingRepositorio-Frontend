export default function TopAppBar() {
  return (
    <header className="fixed top-0 right-0 left-[260px] h-16 z-40 bg-white border-b border-slate-200 flex justify-between items-center px-8">
      <div className="flex items-center gap-4 w-1/3">
        <h2 className="font-headline-md text-slate-800 text-lg font-medium">Registro de Acceso</h2>
      </div>
      <div className="flex items-center gap-6">
        <button className="bg-red-100 text-red-700 font-label-bold py-2 px-4 rounded hover:bg-red-200 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm font-bold">warning</span> Bloqueo de Emergencia
        </button>
        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-slate-900 transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
          </button>
          <button className="hover:text-slate-900 transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer">
          <img alt="Manager Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDojGaD0mgHkUjxjF1IU27YGzLvrDUr40DdUHzp-2UzrYnfQFwU9H2EYo3gkGp79nBgpV_LJk2Sm3dI5ylz3dx-KiNE3iFwfKHloiWLu1luRzbqAlHD-eD0F0NMmCvQ5QL-nWz5n426qGUEn_YrDxRBdWchY13jueD0qr0g_M2doSyuDjCeME45gvcZpTxiB3upd2Mr4D1rCb0czVcczMwfoKLAlnZWHlDCtRJU7gRj62Je3uwSLzJvIYiS1EOwxEQY8Thx3Vu_4RQJ" />
        </div>
      </div>
    </header>
  );
}
