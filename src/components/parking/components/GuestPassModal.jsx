import { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react";
import { parkingService } from "../../../services/parkingService";
import { useParking } from "../context/ParkingContext";

export default function GuestPassModal({ isOpen, onClose }) {
  const { vehicles, addNotification } = useParking();

  const [plate, setPlate] = useState("");
  const [apartamentoId, setApartamentoId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPlate("");
      setApartamentoId("");
      setFechaInicio("");
      setFechaFin("");
    } else {
      setFechaInicio(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen]);

  const plateU = plate.trim().toUpperCase();
  const ficha = useMemo(
    () => vehicles.find((v) => v.placa === plateU) || null,
    [vehicles, plateU],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plateU || !fechaInicio || !fechaFin) {
      alert("Completa todos los campos obligatorios.");
      return;
    }
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      alert("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }
    setSubmitting(true);
    try {
      await parkingService.createPaseInvitado({
        placa: plateU,
        apartamentoId: apartamentoId ? Number(apartamentoId) : null,
        usuarioId: null,
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFin: new Date(fechaFin).toISOString(),
      });
      addNotification("success", `Pase temporal creado para ${plateU}`);
      onClose();
    } catch (err) {
      addNotification("alert", "No se pudo crear el pase temporal", err?.message || "");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="parking-module fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white shadow-2xl h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Crear Pase Temporal</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            {/* PLACA */}
            <div>
              <label className="text-sm font-medium">Placa del vehículo</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase pr-10"
                  placeholder="ABC-123"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {ficha && (
                <p className="text-xs text-gray-500 mt-1">
                  {ficha.propietario} · {ficha.condominioNombre} · {ficha.marca} {ficha.modelo}
                </p>
              )}
              {plateU && !ficha && (
                <p className="text-xs text-amber-600 mt-1">
                  Placa no encontrada. Regístrala primero en "Registrar Nuevo Vehículo".
                </p>
              )}
            </div>

            {/* APARTAMENTO (opcional, se auto-completa del vehículo) */}
            <div>
              <label className="text-sm font-medium">Apartamento (opcional)</label>
              <input
                type="text"
                value={apartamentoId}
                onChange={(e) => setApartamentoId(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder={ficha?.unidad ? `Unidad ${ficha.unidad}` : "ID del apartamento"}
              />
            </div>

            {/* FECHAS */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Fecha inicio</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Fecha fin</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              El vehículo podrá ingresar solo dentro de este rango de fechas.
            </p>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!plateU || !fechaInicio || !fechaFin || submitting}
              className="px-4 py-2 bg-brand text-white rounded-md disabled:opacity-40"
            >
              {submitting ? "Creando…" : "Crear Pase Temporal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
