import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";

const VehicleModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    plate: "",
    unit: "",
    type: "Residente",
    owner: "",
    expiration: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        plate: "",
        unit: "",
        type: "Residente",
        owner: "",
        expiration: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.plate || !formData.unit || !formData.owner) {
      alert("Por favor llena todos los campos obligatorios.");
      return;
    }

    if (formData.type === "Temporal" && !formData.expiration) {
      alert("Selecciona fecha de expiración.");
      return;
    }

    onSave({
      plate: formData.plate,
      unit: formData.unit,
      type: formData.type,
      owner: formData.owner,
      status: "Activo",
      expiration:
        formData.type === "Temporal" ? formData.expiration : null,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">
            Registrar Nuevo Vehículo
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            
            {/* PLACA */}
            <div>
              <label className="text-sm font-medium">Placa</label>
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="ABC-1234"
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Unidad</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tipo</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option>Residente</option>
                  <option>Temporal</option>
                </select>
              </div>
            </div>

            {/* OWNER */}
            <div>
              <label className="text-sm font-medium">Propietario</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            {/* TEMPORAL */}
            {formData.type === "Temporal" && (
              <div className="bg-blue-50 border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  Expiración
                </div>

                <input
                  type="datetime-local"
                  name="expiration"
                  value={formData.expiration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;