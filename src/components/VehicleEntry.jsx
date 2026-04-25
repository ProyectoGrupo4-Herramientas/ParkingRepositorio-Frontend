import { useState } from 'react';

export default function VehicleEntry() {
  const [occupantType, setOccupantType] = useState('Residente');

  return (
    <section className="flex-1 flex flex-col gap-6">
      {/* OCR Simulation Area */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><span className="material-symbols-outlined text-slate-900">videocam</span> Carril 1 - Cámara de Entrada</h3>
          <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Activo</span>
        </div>
        <div className="relative bg-[#3d4b68] rounded-lg overflow-hidden aspect-[16/9] mb-4 flex items-center justify-center border border-slate-200">
          <img alt="Camera Feed" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDu5ohoVQ3y6MPvBCWm3V6JJ_mBnyOD6ecAtGiGqS-mvILLleyedH1ROlvY1rV9nBrFldm3_xRKEXeqf0UCbV2S676QIPACpWpWYWVNsz1PWq9rTUcFtArzDipuotUhqKBB6xdc41r0L573SpX3Fa7IVfSLHY3znp5KBwxxEfMUFyJM1OH38oAx6kShKWTsT18Vsh_Rh2AlRmU07X3AndHtZKFnDlaExJSoK6kG3pTQX0pnEUze4K-_llw2s51KtG9HTk2SlpfBPpD"/>
          {/* OCR Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-green-400 w-1/2 h-1/4 relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-[3px] border-l-[3px] border-green-400 -mt-[1px] -ml-[1px]"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-[3px] border-r-[3px] border-green-400 -mt-[1px] -mr-[1px]"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-[3px] border-l-[3px] border-green-400 -mb-[1px] -ml-[1px]"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[3px] border-r-[3px] border-green-400 -mb-[1px] -mr-[1px]"></div>
            </div>
          </div>
          {/* Simulated OCR Result */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded shadow flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-500 text-sm">document_scanner</span>
            <span className="font-semibold text-slate-800 text-lg tracking-widest">ABC-1234</span>
            <button className="text-slate-500 hover:text-slate-800"><span className="material-symbols-outlined text-sm">refresh</span></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Placa Detectada</label>
            <input className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm font-semibold text-slate-800 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:outline-none uppercase" type="text" defaultValue="ABC-1234"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Tipo de Ocupante</label>
            <div className="flex border border-slate-300 rounded overflow-hidden">
              <button 
                onClick={() => setOccupantType('Residente')}
                className={`flex-1 py-2 text-sm font-bold transition-colors ${occupantType === 'Residente' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                Residente
              </button>
              <button 
                onClick={() => setOccupantType('Visitante')}
                className={`flex-1 py-2 text-sm font-bold transition-colors ${occupantType === 'Visitante' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                Visitante
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Validation & Assignment */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-green-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Residente Autorizado</h4>
            <p className="text-sm text-slate-500">El vehículo coincide con el perfil de John Doe (Apto 4B).</p>
          </div>
        </div>
        <div className="bg-slate-100 border border-slate-200 rounded p-4 mb-6 flex justify-between items-center">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Espacio Asignado</label>
            <div className="text-slate-800 text-xl font-code-num">L2 - 45</div>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-4xl">directions_car</span>
        </div>
        <button className="w-full bg-slate-900 text-white py-3 px-4 rounded font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-sm">login</span> Conceder Acceso y Abrir Puerta
        </button>
      </div>
    </section>
  );
}
