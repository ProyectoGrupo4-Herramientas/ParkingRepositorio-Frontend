import ParkingSpot from "./ParkingSpot";
import type { ParkingSpotType } from "../../services/ParkingService";

interface Props {
  spots: ParkingSpotType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ParkingGrid({ spots, selectedId, onSelect }: Props) {
  const rowA = spots.filter(s => s.code.startsWith("A"));
  const rowB = spots.filter(s => s.code.startsWith("B"));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {rowA.map(spot => (
          <ParkingSpot
            key={spot.id}
            spot={{ ...spot, selected: selectedId === spot.id }}
            onClick={() => onSelect(spot.id)}
          />
        ))}
      </div>

      <div className="relative my-5">
        <div className="border-t border-dashed border-slate-300" />
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0 bg-white px-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold whitespace-nowrap">
          Pasillo Alfa
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {rowB.map(spot => (
          <ParkingSpot
            key={spot.id}
            spot={{ ...spot, selected: selectedId === spot.id }}
            onClick={() => onSelect(spot.id)}
          />
        ))}
      </div>
    </div>
  );
}