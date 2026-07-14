import { useState, useMemo } from "react";
import { useParking } from "../context/ParkingContext";

export function useParkingSelection() {
  const {
    parkingSpaces,
    vehicles,
    accessLog,
    owners,
    loans,
    reassignSpace,
    toggleSpaceMaintenance,
    assignOwner,
    removeOwner,
    createLoan,
    finalizeLoan,
  } = useParking();
  const [selectedId, setSelectedId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const activeLoans = useMemo(
    () => loans.filter((l) => l.estado === "ACTIVO"),
    [loans],
  );

  const spots = useMemo(() => {
    return parkingSpaces.map((space) => {
      const vehicle = space.vehiculoId
        ? vehicles.find((v) => v.id === space.vehiculoId)
        : null;

      const logEntry =
        !vehicle && space.ocupado
          ? accessLog.find((l) => l.espacioId === space.id && !l.horaSalida)
          : null;

      const owner = owners.find(
        (o) => o.idEstacionamiento === space.id,
      );

      const activeLoan = activeLoans.find(
        (l) => l.idEstacionamiento === space.id,
      );

      return {
        id: space.id,
        code: space.code || String(space.id),
        nivel: space.nivel,
        zona: space.zona,
        condominio: space.condominio,
        condominioId: space.condominioId,
        status: space.enMantenimiento
          ? "maintenance"
          : space.ocupado
            ? "occupied"
            : "available",
        plate: vehicle?.placa || logEntry?.placa || null,
        owner: owner?.nombreUsuario || space.propietarioNombre || null,
        ownerId: owner?.idPropietario || null,
        ownerUsuarioId: owner?.idUsuario || space.propietarioUsuarioId || null,
        occupantName: vehicle?.usuarioNombre || logEntry?.propietario || null,
        desc: vehicle?.vehiculoDesc || logEntry?.vehiculoDesc || null,
        unit: vehicle?.unidad || logEntry?.unidad || null,
        ocupanteTipo: space.ocupanteTipo || null,
        activeLoan: activeLoan || null,
        initials: owner?.nombreUsuario
          ? owner.nombreUsuario
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "??",
        icon: space.ocupado
          ? "directions_car"
          : space.enMantenimiento
            ? "build"
            : null,
        tipo: space.tipo,
      };
    });
  }, [parkingSpaces, vehicles, accessLog, owners, activeLoans]);

  const occupancy = useMemo(() => {
    const occupied = spots.filter((s) => s.status === "occupied").length;
    const available = spots.filter((s) => s.status === "available").length;
    return { occupied, available, total: spots.length };
  }, [spots]);

  const selectedSpot = spots.find((s) => s.id === selectedId) || null;

  const handleSelect = (id) => {
    setSelectedId(id);
    setShowDetailsModal(true);
  };

  const closeModal = () => setShowDetailsModal(false);

  const reassignSpot = (spaceId, unit, plate) => {
    reassignSpace(spaceId, plate, unit.resident, unit.code);
  };

  const toggleMaintenance = (spaceId, newStatus) => {
    toggleSpaceMaintenance(spaceId, newStatus);
  };

  const handleAssignOwner = (estacionamientoId, usuarioId, nombreUsuario, placaVehiculo) => {
    assignOwner(estacionamientoId, usuarioId, nombreUsuario, placaVehiculo);
  };

  const handleRemoveOwner = (estacionamientoId) => {
    removeOwner(estacionamientoId);
  };

  const handleCreateLoan = (data) => {
    createLoan(data);
  };

  const handleFinalizeLoan = (loanId) => {
    finalizeLoan(loanId);
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
    handleAssignOwner,
    handleRemoveOwner,
    handleCreateLoan,
    handleFinalizeLoan,
  };
}
