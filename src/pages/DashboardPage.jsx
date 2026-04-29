import React, { useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import VolumeChart from "../components/VolumeChart";
import RecentActivity from "../components/RecentActivity";
import Modal from "../components/Modal";
import { parseISO, isToday, format } from "date-fns";
import {
  Calendar as CalendarIcon,
  LayoutGrid,
  CheckCircle2,
  Car,
  Radio,
  RefreshCw,
} from "lucide-react";
import { useParking } from "../context/ParkingContext";

export default function DashboardPage() {
  const {
    accessLog,
    vehicles,
    spacesAvailable,
    spacesOccupied,
    grantAccess,
    registerManual,
    addVehicle,
  } = useParking();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("OCR");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [activeBar, setActiveBar] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dateInputRef = useRef(null);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const adaptedData = accessLog.map((log) => ({
    id: log.id,
    fecha: log.fecha,
    hora: log.horaEntrada ? `${log.horaEntrada}` : "--",
    placa: log.placa,
    vehiculo: log.vehiculoDesc || "Desconocido",
    residente: log.propietario || "Desconocido",
    unidad: log.unidad || "--",
    tipo:
      log.tipoOcupante === "residente"
        ? "Residente"
        : log.tipoOcupante === "visitante"
          ? "Invitado"
          : log.tipoOcupante === "desconocido"
            ? "Alerta"
            : "Invitado",
    estado:
      log.estadoEntrada === "entrada_aprobada"
        ? "Entrada Aprobada"
        : log.estadoEntrada === "salida_registrada"
          ? "Salida Registrada"
          : "Pendiente Manual",
  }));

  const handleAddEntry = (newEntry) => {
    if (newEntry.tipo === "Alerta") {
      registerManual(newEntry.placa, newEntry.residente);
    } else {
      grantAccess(newEntry.placa);

      // Si no existe en vehículos, agregarlo como temporal/visitante
      const yaExiste = vehicles.find(
        (v) => v.placa.toUpperCase() === newEntry.placa.toUpperCase(),
      );
      if (!yaExiste) {
        addVehicle({
          placa: newEntry.placa.toUpperCase(),
          vehiculoDesc: newEntry.vehiculo || "Desconocido",
          propietario: newEntry.residente || "Invitado",
          unidad: newEntry.unidad || "--",
          tipoOcupante: "visitante",
          estado: "activo",
          fechaExpiracion: null,
          espacioAsignado: null,
        });
      }
    }
  };

  const handleRefresh = () => window.location.reload();

  const getButtonDateText = () => {
    try {
      if (isToday(parseISO(selectedDate))) return "Hoy";
      return format(parseISO(selectedDate), "dd MMM");
    } catch {
      return selectedDate;
    }
  };

  const matchesSearch = (item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.placa?.toLowerCase().includes(q) ||
      item.unidad?.toLowerCase().includes(q) ||
      item.residente?.toLowerCase().includes(q)
    );
  };

  const chartData = React.useMemo(() => {
    const hours = Array(13).fill(0);
    adaptedData
      .filter((item) => item.fecha === selectedDate)
      .forEach((item) => {
        const [h] = item.hora.trim().split(":").map(Number);
        const index = h - 6;
        if (index >= 0 && index < 13) hours[index]++;
      });
    const maxCount = Math.max(...hours, 1);
    return hours.map((count) => ({
      height: (count / maxCount) * 100,
      label: count > 0 ? count.toString() : "",
      realCount: count,
    }));
  }, [adaptedData, selectedDate]);

  const filteredData = React.useMemo(() => {
    return adaptedData.filter((item) => {
      if (item.fecha !== selectedDate) return false;
      if (!matchesSearch(item)) return false;
      if (activeBar === null) return true;
      const targetHour = 6 + activeBar;
      const [h] = item.hora.trim().split(":").map(Number);
      return h === targetHour;
    });
  }, [adaptedData, selectedDate, activeBar, searchQuery]);

  const allDayData = React.useMemo(
    () =>
      adaptedData.filter(
        (item) => item.fecha === selectedDate && matchesSearch(item),
      ),
    [adaptedData, selectedDate, searchQuery],
  );

  const stats = React.useMemo(() => {
    const capacity = spacesAvailable + spacesOccupied;
    const relevantData = adaptedData.filter(
      (item) => item.fecha === selectedDate,
    );
    const entradas = relevantData.filter(
      (i) => i.estado === "Entrada Aprobada",
    ).length;
    return {
      capacity,
      available: spacesAvailable,
      occupied: spacesOccupied,
      active: spacesOccupied,
      activeTrend: entradas,
    };
  }, [adaptedData, selectedDate, spacesAvailable, spacesOccupied]);

  const handleBarSelect = (index) => {
    setActiveBar(activeBar === index ? null : index);
    setShowAll(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setActiveBar(null);
    setShowAll(false);
  };

  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none mb-2">
              Panel de Control
            </h2>
            <p className="text-[14px] text-slate-500">
              Estado del recinto en tiempo real
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => dateInputRef.current?.showPicker()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
              {getButtonDateText()}
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="sr-only"
            />
            <button
              onClick={handleRefresh}
              className="p-2.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="CAPACIDAD TOTAL"
            value={stats.capacity}
            subtitle="Espacios totales"
            icon={LayoutGrid}
          />
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[40px] -z-0" />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500 rounded-full text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
                    DISPONIBLE
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">
                  {stats.available}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {stats.capacity > 0
                    ? Math.round((stats.available / stats.capacity) * 100)
                    : 0}
                  % de la capacidad total
                </p>
              </div>
            </div>
          </div>
          <StatCard
            title="OCUPADAS"
            value={stats.occupied}
            subtitle={`${stats.capacity > 0 ? Math.round((stats.occupied / stats.capacity) * 100) : 0}% de la tasa de ocupación`}
            icon={Car}
          />
          <StatCard
            title="ACTIVAS EN LAS INSTALACIONES"
            value={stats.active}
            subtitle="vs última hora"
            icon={Radio}
            trend="up"
            trendValue={stats.activeTrend}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[320px] flex flex-col">
            <QuickActions onOpenModal={handleOpenModal} />
            <VolumeChart
              data={chartData}
              activeBar={activeBar}
              onBarSelect={handleBarSelect}
            />
          </div>
          <div className="flex-1">
            <RecentActivity
              data={filteredData}
              allDayData={allDayData}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        onSubmit={handleAddEntry}
      />
    </MainLayout>
  );
}
