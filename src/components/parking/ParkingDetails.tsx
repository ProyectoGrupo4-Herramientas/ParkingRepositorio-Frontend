import type { ParkingSpotType } from "../../services/ParkingService";

interface Props {
  spot: ParkingSpotType | null | undefined;
  onClose?: () => void;
}

const statusLabel: Record<string, { label: string; classes: string }> = {
  occupied:    { label: "OCUPADO",       classes: "bg-red-100 text-red-600" },
  available:   { label: "DISPONIBLE",    classes: "bg-green-100 text-green-600" },
  reserved:    { label: "RESERVADO",     classes: "bg-blue-100 text-blue-600" },
  maintenance: { label: "MANTENIMIENTO", classes: "bg-slate-100 text-slate-500" },
};

export default function ParkingDetails({ spot, onClose }: Props) {
  if (!spot) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 text-sm min-h-[200px]">
        <span className="material-symbols-outlined text-slate-300 mb-2" style={{ fontSize: 40 }}>local_parking</span>
        Selecciona un espacio para ver detalles
      </div>
    );
  }

  const { label, classes } = statusLabel[spot.status];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col gap-5">

      <div className="flex items-start justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Espacio {spot.code}</h2>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${classes}`}>
              {label}
            </span>
          </div>
          <p className="text-sm text-slate-400">Nivel 1, Ala Norte</p>
        </div>
        <div className="flex items-center gap-1">
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 lg:hidden">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          )}
          <button className="text-slate-400 hover:text-slate-700">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>more_vert</span>
          </button>
        </div>
      </div>

      {spot.status === "occupied" && spot.plate && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Vehículo Actual</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-slate-600" style={{ fontSize: 22 }}>directions_car</span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-base tracking-wide">{spot.plate}</p>
              <p className="text-xs text-slate-400 mt-0.5">Toyota Camry Plateado</p>
            </div>
          </div>
        </div>
      )}

      {spot.status === "occupied" && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Residente Asignado</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
              JD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">Ocupación Actual</p>
              <p className="text-xs text-slate-400">Unidad 305 • Inquilino Principal</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-auto pt-1">
        <button className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 17 }}>swap_horiz</span>
          Reasignar a Unidad
        </button>
        <button className="w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 17 }}>build</span>
          Marcar para Mantenimiento
        </button>
      </div>
    </div>
  );
}