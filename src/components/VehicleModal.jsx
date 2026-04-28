import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import clsx from 'clsx';

const VehicleModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    plate: '',
    unit: '',
    type: 'Residente',
    owner: '',
    expiration: ''
  });

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        plate: '',
        unit: '',
        type: 'Residente',
        owner: '',
        expiration: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plate || !formData.unit || !formData.owner) {
      alert("Por favor llena todos los campos obligatorios.");
      return;
    }
    
    if (formData.type === 'Temporal' && !formData.expiration) {
      alert("Por favor selecciona una fecha de expiración para el pase temporal.");
      return;
    }

    const newVehicle = {
      plate: formData.plate,
      unit: formData.unit,
      type: formData.type,
      owner: formData.owner,
      status: 'Activo',
      expiration: formData.type === 'Temporal' ? formData.expiration : null
    };

    onSave(newVehicle);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 translate-x-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Registrar Nuevo Vehículo</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Placa</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="plate"
                      value={formData.plate}
                      onChange={handleChange}
                      placeholder="ej. ABC-1234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm sm:text-sm uppercase"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unidad / Apt</label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      placeholder="e.g. A-402"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm sm:text-sm uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm sm:text-sm bg-white"
                    >
                      <option value="Residente">Residente</option>
                      <option value="Temporal">Temporal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Conditional Section for Temporal */}
              {formData.type === 'Temporal' && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5 mt-6">
                  <div className="flex items-center mb-4 text-blue-900">
                    <Clock className="w-4 h-4 mr-2" />
                    <h3 className="text-sm font-semibold">Detalles del Pase Temporal</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha y hora de expiración</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="expiration"
                        value={formData.expiration}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 shadow-sm sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end space-x-3 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-sm transition-colors"
            >
              Guardar Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
