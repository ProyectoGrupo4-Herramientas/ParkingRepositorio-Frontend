import React, { useState } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, onSubmit, type }) => {
  const [placa, setPlaca] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [residente, setResidente] = useState("");
  const [unidad, setUnidad] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!placa) return;
    onSubmit({
      placa: placa.toUpperCase(),
      vehiculo:
        vehiculo || (type === "OCR" ? "Desconocido" : "Vehículo Invitado"),
      residente: residente || (type === "OCR" ? "Desconocido" : "Invitado"),
      tipo: type === "OCR" ? "Alerta" : "Invitado",
      estado: type === "OCR" ? "Pendiente Manual" : "Entrada Aprobada",
      unidad: type === "Invitado" ? unidad || "Pase Temporal" : "--",
    });
    setPlaca("");
    setVehiculo("");
    setResidente("");
    setUnidad("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {type === "OCR"
              ? "Entrada Manual (OCR Fallido)"
              : "Registro de Invitados"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Placa / Matrícula *
            </label>
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="Ej. ABC-1234"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent uppercase"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Vehículo (Opcional)
            </label>
            <input
              type="text"
              value={vehiculo}
              onChange={(e) => setVehiculo(e.target.value)}
              placeholder="Ej. Toyota Corolla"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
          {type === "Invitado" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nombre del Invitado
                </label>
                <input
                  type="text"
                  value={residente}
                  onChange={(e) => setResidente(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Unidad a Visitar
                </label>
                <input
                  type="text"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  placeholder="Ej. Unidad 402"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Registrar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
