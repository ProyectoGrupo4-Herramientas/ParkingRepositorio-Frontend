import type { ParkingSpotType } from "../../services/ParkingService";

interface Props {
  spot: ParkingSpotType;
  onClick?: () => void;
}

const statusStyles: Record<string, string> = {
  occupied:    "border-slate-200 bg-white hover:shadow-md",
  available:   "border-slate-200 bg-green-50/70 hover:shadow-md",
  reserved:    "border-slate-200 bg-white hover:shadow-md",
  maintenance: "border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed",
};

const iconColor: Record<string, string> = {
  occupied:    "text-red-400",
  available:   "text-green-400",
  reserved:    "text-blue-400",
  maintenance: "text-slate-400",
};

export default function ParkingSpot({ spot, onClick }: Props) {
  return (
    <button
      onClick={spot.status !== "maintenance" ? onClick : undefined}
      className={`
        border rounded-xl p-2.5 h-24 sm:h-28 flex flex-col justify-between
        text-left transition-all cursor-pointer w-full
        ${statusStyles[spot.status]}
        ${spot.selected ? "ring-2 ring-slate-900 shadow-md" : ""}
      `}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-700">{spot.code}</span>
        {spot.icon && (
          <span className={`material-symbols-outlined ${iconColor[spot.status]} flex-shrink-0`} style={{ fontSize: 14 }}>
            {spot.icon}
          </span>
        )}
      </div>

      <div className="w-full">
        {spot.status === "occupied" && spot.plate && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] sm:text-xs text-center py-1 rounded-lg font-bold tracking-wide truncate">
            {spot.plate}
          </div>
        )}
        {spot.status === "available" && (
          <p className="text-[10px] sm:text-xs text-green-600 font-medium leading-tight">Ocupación<br />Actual</p>
        )}
        {spot.status === "reserved" && (
          <p className="text-[10px] sm:text-xs text-blue-500 font-medium leading-tight">Ocupación<br />Actual</p>
        )}
        {spot.status === "maintenance" && (
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Mantenimiento</p>
        )}
      </div>
    </button>
  );
}