import { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import ParkingGrid from "../components/parking/grid/ParkingGrid";
import ParkingDetails from "../components/parking/details/ParkingDetails";
import OccupancyCard from "../components/parking/cards/OccupancyCard";
import DetailsBottomSheet from "../components/parking/details/DetailsBottomSheet";
import { useParkingSelection } from "../hooks/UseParkingSelection";

export default function ParkingMapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    return spots.filter((s) => {
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        !searchQuery ||
        (s.plate || "").toLowerCase().includes(q) ||
        (s.code || "").toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [spots, searchQuery, statusFilter]);

  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Estacionamiento
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Estado y asignación en tiempo real.
          </p>
        </div>

        <OccupancyCard data={occupancy} />
      </div>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <span className="text-sm text-slate-500">Filtrar:</span>

        <div className="relative w-full sm:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              w-full appearance-none
              bg-white border border-slate-200
              text-slate-700 text-sm font-medium
              px-4 py-2.5 pr-10
              rounded-xl shadow-sm
              hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900
              transition-all cursor-pointer
            "
          >
            <option value="all">Todos</option>
            <option value="available">Disponibles</option>
            <option value="occupied">Ocupados</option>
            <option value="maintenance">Mantenimiento</option>
          </select>

          {/* flecha custom */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-base">
              expand_more
            </span>
          </div>
        </div>
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

      {/* MOBILE HINT */}
      {!showDetailsModal && (
        <p className="lg:hidden text-center text-xs text-slate-400 mt-4">
          Toca un espacio para ver los detalles
        </p>
      )}

      {/* BOTTOM SHEET */}
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
