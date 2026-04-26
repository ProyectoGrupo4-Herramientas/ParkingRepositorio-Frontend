import { useState, useEffect } from "react";
import { getSpots, getOccupancy } from "../services/ParkingService";
import type { ParkingSpotType, OccupancyData } from "../services/ParkingService";

export function useParkingSelection() {
  const [spots, setSpots] = useState<ParkingSpotType[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    getSpots().then(setSpots);
    getOccupancy().then(setOccupancy);
  }, []);

  const selectedSpot = spots.find(s => s.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setShowDetailsModal(true);
  };

  const closeModal = () => setShowDetailsModal(false);

  return { spots, occupancy, selectedId, selectedSpot, showDetailsModal, handleSelect, closeModal };
}