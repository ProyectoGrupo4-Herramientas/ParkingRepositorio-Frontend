import React from 'react';
import { ScanLine, UserPlus } from 'lucide-react';

const QuickActions = ({ onOpenModal }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Acciones Rápidas</h3>

      <div className="space-y-3">
        { }
        <button
          onClick={() => onOpenModal('OCR')}
          className="w-full flex items-center p-4 bg-slate-900 hover:bg-slate-800 transition-colors rounded-xl text-left group"
        >
          <div className="p-3 bg-slate-800 rounded-lg mr-4 group-hover:bg-slate-700 transition-colors">
            <ScanLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">OCR / Entrada Manual</div>
            <div className="text-xs text-slate-400 mt-0.5">Escanear matrícula manualmente</div>
          </div>
        </button>

        { }
        <button
          onClick={() => onOpenModal('Invitado')}
          className="w-full flex items-center p-4 bg-white border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl text-left group"
        >
          <div className="p-3 bg-slate-100 rounded-lg mr-4 group-hover:bg-slate-200 transition-colors">
            <UserPlus className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Registro de Invitados</div>
            <div className="text-xs text-slate-500 mt-0.5">Emitir pase temporal</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
