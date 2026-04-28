import { useState, useEffect } from "react";
import { getSpots, getOccupancy } from "../services/ParkingService";

export function useParkingSelection() {
  const [spots, setSpots] = useState([]);
  const [occupancy, setOccupancy] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    getSpots().then(setSpots);
    getOccupancy().then(setOccupancy);
  }, []);

  const selectedSpot = spots.find((s) => s.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setShowDetailsModal(true);
  };

  const closeModal = () => setShowDetailsModal(false);

  const reassignSpot = (spotId, unit, plate) => {
    setSpots((prev) =>
      prev.map((s) =>
        s.id === spotId ? { ...s, status: "occupied", unit, plate } : s,
      ),
    );
  };

  const toggleMaintenance = (spotId, newStatus) => {
    setSpots((prev) =>
      prev.map((s) =>
        s.id === spotId
          ? {
              ...s,
              status: newStatus,
              unit: newStatus === "maintenance" ? null : s.unit,
            }
          : s,
      ),
    );
  };

  return {
    spots,
    occupancy,
    selectedId,
    selectedSpot,
    showDetailsModal,
    handleSelect,
    closeModal,
    reassignSpot,
    toggleMaintenance,
  };
}
