import type { OccupancyData } from "../../services/ParkingService";

interface Props {
  data: OccupancyData | null;
}

export default function OccupancyCard({ data }: Props) {
  if (!data) return null;

  const percent = Math.round((data.occupied / data.total) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-4 sm:gap-6 self-start flex-shrink-0">
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Ocupación Actual</p>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{percent}%</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          <span className="text-slate-600 font-medium text-xs sm:text-sm">{data.occupied} Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-slate-600 font-medium text-xs sm:text-sm">{data.available} Disponible</span>
        </div>
      </div>
    </div>
  );
}