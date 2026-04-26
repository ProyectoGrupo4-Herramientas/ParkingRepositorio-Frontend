import React from 'react';
import { CarFront, Truck, Car, Ban } from 'lucide-react';
import clsx from 'clsx';

const getVehicleIcon = (tipo) => {
  switch (tipo) {
    case 'Residente': return <Car className="w-5 h-5 text-slate-500" />;
    case 'Entrega': return <Truck className="w-5 h-5 text-slate-500" />;
    case 'Alerta': return <Ban className="w-5 h-5 text-red-500" />;
    default: return <CarFront className="w-5 h-5 text-slate-500" />;
  }
};

const getStatusBadge = (estado) => {
  const e = estado.toUpperCase();
  if (e.includes('ENTRADA APROBADA')) {
    return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>{e}</span>;
  }
  if (e.includes('SALIDA REGISTRADA')) {
    return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-blue-50 text-blue-700 tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>{e}</span>;
  }
  if (e.includes('PENDIENTE MANUAL')) {
    return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700 tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>{e}</span>;
  }
  return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-700 tracking-wider">{e}</span>;
};

const RecentActivity = ({ data, allDayData }) => {
  const [showAll, setShowAll] = React.useState(false);
  const displayData = showAll ? allDayData : data.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 flex items-center justify-between border-b border-slate-50">
        <h3 className="text-lg font-semibold text-slate-900">Actividad de Acceso Reciente</h3>
        <button
          onClick={(e) => { e.preventDefault(); setShowAll(!showAll); }}
          className="text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors"
        >
          {showAll ? 'Ver Menos' : 'Ver Todo'}
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehículo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Residente / Unidad</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hora</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displayData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={clsx("flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg", row.tipo === 'Alerta' ? "bg-red-50" : "bg-slate-100")}>
                      {getVehicleIcon(row.tipo)}
                    </div>
                    <div className="ml-4">
                      <div className={clsx("text-sm font-bold", row.tipo === 'Alerta' ? "text-red-600" : "text-slate-900")}>{row.placa}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{row.vehiculo}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">{row.residente}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {row.tipo === 'Alerta' ? <span className="italic text-slate-400">Requiere Entrada Manual</span> : `${row.unidad} • ${row.tipo === 'Residente' ? 'Spot A12' : 'Spot V1'}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-slate-900">{row.hora.split(' ')[0]}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{row.hora.split(' ')[1]}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {getStatusBadge(row.estado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
