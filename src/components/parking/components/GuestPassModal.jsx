import { useState, useEffect, useMemo } from "react";
import { X, Search, CheckCircle } from "lucide-react";
import { parkingService } from "../../../services/parkingService";
import { useParking } from "../context/ParkingContext";

export default function GuestPassModal({ isOpen, onClose }) {
  const { vehicles, addNotification } = useParking();

  const [plate, setPlate] = useState("");
  const [nombreInvitado, setNombreInvitado] = useState("");
  const [apartamentoId, setApartamentoId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setPlate("");
      setNombreInvitado("");
      setApartamentoId("");
      setFechaInicio("");
      setFechaFin("");
      setCreatedCode(null);
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
      const pase = await parkingService.createPaseInvitado({
        placa: plateU,
        nombreInvitado: nombreInvitado.trim() || plateU,
        apartamentoId: apartamentoId ? Number(apartamentoId) : null,
        usuarioId: null,
        fechaInicio: new Date(fechaInicio).toISOString().replace(".000Z", ""),
        fechaFin: new Date(fechaFin).toISOString().replace(".000Z", ""),
      });
      setCreatedCode(pase?.codigo || pase?.codigoPase || "PASE-XXXXXXXX");
      addNotification("success", `Pase temporal creado para ${plateU}`);
    } catch (err) {
      addNotification("alert", "No se pudo crear el pase temporal", err?.message || "");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    setCreatedCode(null);
    onClose();
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

        {createdCode ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Pase creado exitosamente</h3>
          <p className="text-sm text-slate-500 mb-4">
            El vehículo <strong>{plateU}</strong> tiene acceso autorizado hasta el {new Date(fechaFin).toLocaleDateString("es-PE")}.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-3 mb-6">
            <p className="text-xs text-slate-400 mb-0.5">Código del pase</p>
            <p className="text-lg font-mono font-bold text-slate-900">{createdCode}</p>
          </div>
          <button onClick={handleDone} className="px-6 py-2 bg-brand text-white rounded-lg font-medium">
            Finalizar
          </button>
        </div>
      ) : (
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

            {/* NOMBRE DEL INVITADO */}
            <div>
              <label className="text-sm font-medium">Nombre del invitado</label>
              <input
                type="text"
                value={nombreInvitado}
                onChange={(e) => setNombreInvitado(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nombre completo"
              />
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
      )}
      </div>
    </div>
  );
}
