import ParkingSpot from "./ParkingSpot";

export default function ParkingGrid({ spots, selectedId, onSelect }) {
  const rows = ["A", "B", "C"];

  const groupedSpots = rows.map((row) => ({
    label: row,
    spots: spots.filter((s) => s.code.startsWith(row)),
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      {groupedSpots.map((group, index) => (
        <div key={group.label}>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {group.spots.map((spot) => (
              <ParkingSpot
                key={spot.id}
                spot={spot}
                isSelected={selectedId === spot.id}
                onClick={() => onSelect(spot.id)}
              />
            ))}
          </div>

          {index < groupedSpots.length - 1 && (
            <div className="my-5 border-t border-dashed border-slate-200" />
          )}
        </div>
      ))}
    </div>
  );
}
