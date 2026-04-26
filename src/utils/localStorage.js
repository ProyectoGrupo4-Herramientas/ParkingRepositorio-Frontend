import { initialVehicles } from '../data/initialData';

const STORAGE_KEY = 'parkcontrol_vehicles_v2';

export const getVehicles = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVehicles));
    return initialVehicles;
  }
  return JSON.parse(data);
};

export const saveVehicles = (vehicles) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
};

// Check if a temporal pass is expired based on current date
export const updateStatuses = (vehicles) => {
  const now = new Date();
  let changed = false;
  
  const updatedVehicles = vehicles.map(v => {
    if (v.type === 'Temporal' && v.expiration) {
      const expDate = new Date(v.expiration);
      const isExpired = expDate < now;
      const expectedStatus = isExpired ? 'Expirado' : 'Activo';
      
      if (v.status !== expectedStatus) {
        changed = true;
        return { ...v, status: expectedStatus };
      }
    }
    return v;
  });
  
  if (changed) {
    saveVehicles(updatedVehicles);
  }
  
  return updatedVehicles;
};
