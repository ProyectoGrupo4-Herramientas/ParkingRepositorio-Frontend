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
import { useLocalStorage } from "../hooks/useLocalStorage";
import { accessData as initialData } from "../data";

export default function DashboardPage() {
  const [data, setData] = useLocalStorage("parkcontrol_data_v2", initialData);
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

  const handleAddEntry = (newEntry) => {
    const entry = {
      id: Date.now(),
      fecha: selectedDate,
      hora: format(new Date(), "hh:mm a"),
      duracion: "--",
      ...newEntry,
    };
    setData([entry, ...data]);
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
    data
      .filter((item) => item.fecha === selectedDate)
      .forEach((item) => {
        const parts = item.hora.match(/(\d+):(\d+)\s+(AM|PM)/i);
        if (parts) {
          let h = parseInt(parts[1], 10);
          if (h === 12) h = 0;
          if (parts[3].toUpperCase() === "PM") h += 12;
          const index = h - 6;
          if (index >= 0 && index < 13) hours[index]++;
        }
      });
    const maxCount = Math.max(...hours, 1);
    return hours.map((count) => ({
      height: (count / maxCount) * 100,
      label: count > 0 ? count.toString() : "",
      realCount: count,
    }));
  }, [data, selectedDate]);

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      if (item.fecha !== selectedDate) return false;
      if (!matchesSearch(item)) return false;
      if (activeBar === null) return true;

      const hour24 = 6 + activeBar;
      const expectedAmPm = hour24 >= 12 ? "PM" : "AM";
      let expectedHour12 = hour24 % 12;
      if (expectedHour12 === 0) expectedHour12 = 12;

      const parts = item.hora.match(/(\d+):(\d+)\s+(AM|PM)/i);
      if (!parts) return false;

      return (
        parseInt(parts[1], 10) === expectedHour12 &&
        parts[3].toUpperCase() === expectedAmPm
      );
    });
  }, [data, selectedDate, activeBar, searchQuery]);

  const allDayData = React.useMemo(
    () =>
      data.filter((item) => item.fecha === selectedDate && matchesSearch(item)),
    [data, selectedDate, searchQuery],
  );

  const stats = React.useMemo(() => {
    const capacity = 450;
    const baseOccupied = 330;
    const relevantData = data.filter((item) => item.fecha === selectedDate);
    const entradas = relevantData.filter((i) =>
      i.estado?.includes("Entrada"),
    ).length;
    const salidas = relevantData.filter((i) =>
      i.estado?.includes("Salida"),
    ).length;
    const pendientes = relevantData.filter((i) =>
      i.estado?.includes("Pendiente"),
    ).length;
    const occupied = baseOccupied + entradas - salidas;
    return {
      capacity,
      available: capacity - occupied,
      occupied,
      active: occupied + pendientes + 4,
      activeTrend: entradas,
    };
  }, [data, selectedDate]);

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
        {/* HEADER */}
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100
                rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200
                transition-colors border border-slate-200 cursor-pointer"
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="CAPACIDAD TOTAL"
            value={stats.capacity}
            subtitle="Espacios asignados y de visitantes"
            icon={LayoutGrid}
          />
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[40px] -z-0"></div>
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
                  24% de la capacidad total
                </p>
              </div>
            </div>
          </div>
          <StatCard
            title="OCUPADAS"
            value={stats.occupied}
            subtitle="76% de la tasa de ocupación"
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

        {/* CONTENT */}
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
