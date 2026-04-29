// src/context/ParkingContext.jsx

import { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  initialVehicles,
  initialParkingSpaces,
  initialAccessLog,
} from "../data/parkingState";
import { format } from "date-fns";

const ParkingContext = createContext(null);

export function ParkingProvider({ children }) {
  const [vehicles, setVehicles] = useLocalStorage(
    "parking_vehicles",
    initialVehicles,
  );
  const [parkingSpaces, setParkingSpaces] = useLocalStorage(
    "parking_spaces",
    initialParkingSpaces,
  );
  const [accessLog, setAccessLog] = useLocalStorage(
    "parking_accesslog",
    initialAccessLog,
  );
  const [notifications, setNotifications] = useLocalStorage(
    "parking_notifications",
    [],
  );

  const generateId = (prefix) =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const calcDuracion = (horaEntrada, horaSalida) => {
    if (!horaEntrada || !horaSalida) return null;
    const [hE, mE] = horaEntrada.split(":").map(Number);
    const [hS, mS] = horaSalida.split(":").map(Number);
    const totalMin = hS * 60 + mS - (hE * 60 + mE);
    if (totalMin <= 0) return null;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const addNotification = useCallback(
    (type, message, detail = "") => {
      const newNotif = {
        id: generateId("notif"),
        type,
        message,
        detail,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
    },
    [setNotifications],
  );

  const getFirstAvailableSpace = useCallback(
    (tipoOcupante) => {
      return (
        parkingSpaces.find(
          (s) => !s.ocupado && !s.enMantenimiento && s.tipo === tipoOcupante,
        ) || null
      );
    },
    [parkingSpaces],
  );

  // ─────────────────────────────────────────
  // VEHÍCULOS — CRUD
  // ─────────────────────────────────────────

  const addVehicle = useCallback(
    (vehicleData) => {
      const newVehicle = {
        id: generateId("v"),
        ...vehicleData,
        estado: vehicleData.estado || "activo",
        fechaExpiracion: vehicleData.fechaExpiracion || null,
        espacioAsignado: vehicleData.espacioAsignado || null,
      };
      setVehicles((prev) => [...prev, newVehicle]);
      addNotification(
        "success",
        `Nuevo vehículo registrado — ${newVehicle.placa}`,
        `${newVehicle.propietario} • ${newVehicle.unidad || "--"} • ${
          newVehicle.tipoOcupante === "residente" ? "Residente" : "Visitante"
        }`,
      );
      return newVehicle;
    },
    [setVehicles, addNotification],
  );

  const updateVehicle = useCallback(
    (id, changes) => {
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...changes } : v)),
      );
    },
    [setVehicles],
  );

  const removeVehicle = useCallback(
    (id) => {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setParkingSpaces((prev) =>
        prev.map((s) =>
          s.vehiculoId === id ? { ...s, ocupado: false, vehiculoId: null } : s,
        ),
      );
    },
    [setVehicles, setParkingSpaces],
  );

  // ─────────────────────────────────────────
  // ACCESO — CONCEDER / REGISTRAR SALIDA
  // ─────────────────────────────────────────

  const grantAccess = useCallback(
    (placa) => {
      const horaEntrada = format(new Date(), "HH:mm");
      const fecha = format(new Date(), "yyyy-MM-dd");
      const vehicle = vehicles.find(
        (v) => v.placa.toUpperCase() === placa.toUpperCase(),
      );

      let espacioId = null;

      if (vehicle) {
        if (vehicle.espacioAsignado) {
          espacioId = vehicle.espacioAsignado;
        } else {
          const espacioLibre = getFirstAvailableSpace(
            vehicle.tipoOcupante === "residente" ? "residente" : "visitante",
          );
          if (espacioLibre) {
            espacioId = espacioLibre.id;
            updateVehicle(vehicle.id, { espacioAsignado: espacioId });
          }
        }
        if (espacioId) {
          setParkingSpaces((prev) =>
            prev.map((s) =>
              s.id === espacioId
                ? { ...s, ocupado: true, vehiculoId: vehicle.id }
                : s,
            ),
          );
        }
      } else {
        // Vehículo no registrado — asignar espacio visitante y ocuparlo
        const espacioLibre =
          getFirstAvailableSpace("visitante") ||
          getFirstAvailableSpace("residente");
        if (espacioLibre) {
          espacioId = espacioLibre.id;
          setParkingSpaces((prev) =>
            prev.map((s) =>
              s.id === espacioId
                ? { ...s, ocupado: true, vehiculoId: null }
                : s,
            ),
          );
        }
      }

      const newLog = {
        id: generateId("log"),
        vehiculoId: vehicle?.id || null,
        placa: placa.toUpperCase(),
        propietario: vehicle?.propietario || "Desconocido",
        unidad: vehicle?.unidad || null,
        tipoOcupante: vehicle?.tipoOcupante || "visitante",
        vehiculoDesc: vehicle?.vehiculoDesc || "Desconocido",
        espacioId,
        fecha,
        horaEntrada,
        horaSalida: null,
        duracion: null,
        estadoEntrada: "entrada_aprobada",
      };

      setAccessLog((prev) => [newLog, ...prev]);
      addNotification(
        "success",
        `Entrada aprobada — ${placa.toUpperCase()}`,
        vehicle
          ? `${vehicle.propietario} • ${vehicle.unidad || "Visitante"} • Espacio ${espacioId || "--"}`
          : `Visitante • Espacio ${espacioId || "--"}`,
      );

      return newLog;
    },
    [
      vehicles,
      parkingSpaces,
      getFirstAvailableSpace,
      updateVehicle,
      setParkingSpaces,
      setAccessLog,
      addNotification,
    ],
  );

  const registerExit = useCallback(
    (placa) => {
      const horaSalida = format(new Date(), "HH:mm");

      const logActivo = accessLog.find(
        (log) =>
          log.placa.toUpperCase() === placa.toUpperCase() &&
          (log.estadoEntrada === "entrada_aprobada" ||
            log.estadoEntrada === "pendiente_manual") &&
          !log.horaSalida,
      );

      if (!logActivo) {
        addNotification(
          "warning",
          `Sin entrada activa — ${placa.toUpperCase()}`,
          "No se encontró registro de entrada",
        );
        return null;
      }

      const updatedLog = {
        ...logActivo,
        horaSalida,
        duracion: calcDuracion(logActivo.horaEntrada, horaSalida),
        estadoEntrada: "salida_registrada",
      };

      setAccessLog((prev) =>
        prev.map((log) => (log.id === logActivo.id ? updatedLog : log)),
      );

      if (logActivo.espacioId) {
        setParkingSpaces((prev) =>
          prev.map((s) =>
            s.id === logActivo.espacioId
              ? { ...s, ocupado: false, vehiculoId: null }
              : s,
          ),
        );

        // 4. También limpiar espacioAsignado del vehículo si es visitante
        if (logActivo.vehiculoId) {
          const vehicle = vehicles.find((v) => v.id === logActivo.vehiculoId);
          if (vehicle && vehicle.tipoOcupante !== "residente") {
            updateVehicle(vehicle.id, { espacioAsignado: null });
          }
        }
      }

      addNotification(
        "info",
        `Salida registrada — ${placa.toUpperCase()}`,
        `Duración: ${updatedLog.duracion || "--"} • Espacio ${logActivo.espacioId || "--"} liberado`,
      );

      return updatedLog;
    },
    [
      accessLog,
      vehicles,
      setAccessLog,
      setParkingSpaces,
      updateVehicle,
      addNotification,
    ],
  );

  const registerManual = useCallback(
    (placa, propietario) => {
      const horaEntrada = format(new Date(), "HH:mm");
      const fecha = format(new Date(), "yyyy-MM-dd");

      const espacioLibre =
        getFirstAvailableSpace("visitante") ||
        getFirstAvailableSpace("residente");

      const espacioId = espacioLibre?.id || null;

      if (espacioId) {
        setParkingSpaces((prev) =>
          prev.map((s) =>
            s.id === espacioId ? { ...s, ocupado: true, vehiculoId: null } : s,
          ),
        );
      }

      const newLog = {
        id: generateId("log"),
        vehiculoId: null,
        placa: placa || "ILEGIBLE",
        propietario: propietario || "Desconocido",
        unidad: null,
        tipoOcupante: "desconocido",
        vehiculoDesc: "Desconocido",
        espacioId,
        fecha,
        horaEntrada,
        horaSalida: null,
        duracion: null,
        estadoEntrada: "pendiente_manual",
      };

      setAccessLog((prev) => [newLog, ...prev]);
      addNotification(
        "alert",
        `⚠️ Pendiente manual — ${placa || "ILEGIBLE"}`,
        `Requiere revisión y entrada manual${espacioId ? ` • Espacio ${espacioId}` : ""}`,
      );

      return newLog;
    },
    [setAccessLog, setParkingSpaces, getFirstAvailableSpace, addNotification],
  );

  // ─────────────────────────────────────────
  // ESPACIOS
  // ─────────────────────────────────────────

  const reassignSpace = useCallback(
    (spaceId, placa, propietario, unidad) => {
      const vehicle = vehicles.find(
        (v) => v.placa.toUpperCase() === placa.toUpperCase(),
      );

      if (vehicle) {
        updateVehicle(vehicle.id, { espacioAsignado: spaceId });
        setParkingSpaces((prev) =>
          prev.map((s) =>
            s.id === spaceId
              ? { ...s, ocupado: true, vehiculoId: vehicle.id }
              : s,
          ),
        );
      } else {
        const newVehicle = {
          id: generateId("v"),
          placa: placa.toUpperCase(),
          vehiculoDesc: "Desconocido",
          propietario: propietario || "Desconocido",
          unidad: unidad || "--",
          espacioAsignado: spaceId,
          tipoOcupante: "visitante",
          estado: "activo",
          fechaExpiracion: null,
        };
        setVehicles((prev) => [...prev, newVehicle]);
        setParkingSpaces((prev) =>
          prev.map((s) =>
            s.id === spaceId
              ? { ...s, ocupado: true, vehiculoId: newVehicle.id }
              : s,
          ),
        );
      }
    },
    [vehicles, updateVehicle, setParkingSpaces, setVehicles],
  );

  const toggleSpaceMaintenance = useCallback(
    (spaceId, newStatus) => {
      setParkingSpaces((prev) =>
        prev.map((s) => {
          if (s.id !== spaceId) return s;
          if (newStatus === "maintenance") {
            return {
              ...s,
              ocupado: false,
              vehiculoId: null,
              enMantenimiento: true,
            };
          }
          return { ...s, enMantenimiento: false };
        }),
      );
    },
    [setParkingSpaces],
  );

  // ─────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────

  const resetAll = useCallback(() => {
    setVehicles(initialVehicles);
    setParkingSpaces(initialParkingSpaces);
    setAccessLog(initialAccessLog);
  }, [setVehicles, setParkingSpaces, setAccessLog]);

  // ─────────────────────────────────────────
  // QUERIES DERIVADAS
  // ─────────────────────────────────────────

  const recentActivity = accessLog.slice(0, 10);
  const activeVehicles = vehicles.filter((v) => v.estado === "activo");
  const expiredVehicles = vehicles.filter((v) => v.estado === "expirado");
  const spacesAvailable = parkingSpaces.filter(
    (s) => !s.ocupado && !s.enMantenimiento,
  ).length;
  const spacesOccupied = parkingSpaces.filter((s) => s.ocupado).length;

  // ─────────────────────────────────────────
  // VALUE
  // ─────────────────────────────────────────

  const value = {
    vehicles,
    parkingSpaces,
    accessLog,

    recentActivity,
    activeVehicles,
    expiredVehicles,
    spacesAvailable,
    spacesOccupied,

    addVehicle,
    updateVehicle,
    removeVehicle,

    grantAccess,
    registerExit,
    registerManual,

    reassignSpace,
    toggleSpaceMaintenance,

    getFirstAvailableSpace,
    resetAll,

    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead: (id) =>
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      ),
    markAllAsRead: () =>
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    clearNotifications: () => setNotifications([]),
  };

  return (
    <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>
  );
}

export function useParking() {
  const ctx = useContext(ParkingContext);
  if (!ctx)
    throw new Error("useParking debe usarse dentro de <ParkingProvider>");
  return ctx;
}
