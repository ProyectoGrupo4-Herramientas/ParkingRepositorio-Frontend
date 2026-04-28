import { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import ParkingGrid from "../components/parking/ParkingGrid";
import ParkingDetails from "../components/parking/ParkingDetails";
import OccupancyCard from "../components/parking/OccupancyCard";
import DetailsBottomSheet from "../components/parking/DetailsBottomSheet";
import { useParkingSelection } from "../hooks/UseParkingSelection";

export default function ParkingMapPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    spots,
    occupancy,
    selectedId,
    selectedSpot,
    showDetailsModal,
    handleSelect,
    closeModal,
    reassignSpot,
    toggleMaintenance,
  } = useParkingSelection();

  const filteredSpots = useMemo(() => {
    if (!searchQuery) return spots;

    const q = searchQuery.toLowerCase();

    return spots.filter(
      (s) =>
        (s.plate || "").toLowerCase().includes(q) ||
        (s.code || "").toLowerCase().includes(q),
    );
  }, [spots, searchQuery]);

  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Nivel de Estacionamiento 1 (Norte)
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Estado y mapa de asignación en tiempo real.
          </p>
        </div>
        <OccupancyCard data={occupancy} />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <ParkingGrid
            spots={filteredSpots}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
        <div className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0">
          <ParkingDetails
            spot={selectedSpot}
            onReassign={reassignSpot}
            onToggleMaintenance={toggleMaintenance}
          />
        </div>
      </div>

      {/* HINT MOBILE */}
      {!showDetailsModal && (
        <p className="lg:hidden text-center text-xs text-slate-400 mt-4">
          Toca un espacio para ver los detalles
        </p>
      )}

      {/* BOTTOM SHEET MOBILE */}
      {showDetailsModal && (
        <DetailsBottomSheet
          spot={selectedSpot}
          onClose={closeModal}
          onReassign={reassignSpot}
          onToggleMaintenance={toggleMaintenance}
        />
      )}
    </MainLayout>
  );
}
