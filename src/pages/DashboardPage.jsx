import React, { useState } from "react";

import MainLayout from "../layouts/MainLayout";

import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import VolumeChart from "../components/VolumeChart";
import RecentActivity from "../components/RecentActivity";
import Modal from "../components/Modal";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { accessData as initialData } from "../data";

import {
  LayoutGrid,
  CheckCircle2,
  Car,
  Radio,
  RefreshCw
} from "lucide-react";

import { format } from "date-fns";

export default function DashboardPage() {
  const [data, setData] = useLocalStorage("parkcontrol_data_v2", initialData);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("OCR");

  const [selectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const currentHour = new Date().getHours();
  const defaultBar =
    currentHour >= 6 && currentHour <= 18 ? currentHour - 6 : 2;

  const [activeBar, setActiveBar] = useState(defaultBar);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleAddEntry = (newEntry) => {
    const now = new Date();

    const entry = {
      id: Date.now(),
      fecha: selectedDate,
      hora: format(now, "hh:mm a"),
      duracion: "--",
      ...newEntry,
    };

    setData([entry, ...data]);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const chartData = React.useMemo(() => {
    const hours = Array(13).fill(0);
    const dateData = data.filter((item) => item.fecha === selectedDate);

    dateData.forEach((item) => {
      const parts = item.hora.match(/(\d+):(\d+)\s+(AM|PM)/i);
      if (parts) {
        let h = parseInt(parts[1], 10);
        const ampm = parts[3].toUpperCase();

        if (h === 12) h = 0;
        if (ampm === "PM") h += 12;

        const index = h - 6;
        if (index >= 0 && index < 13) {
          hours[index]++;
        }
      }
    });

    const maxCount = Math.max(...hours, 1);

    return hours.map((count) => ({
      height: (count / maxCount) * 100,
      label: count > 0 ? count.toString() : "",
      realCount: count,
    }));
  }, [data, selectedDate]);

  const stats = React.useMemo(() => {
    const capacity = 450;
    const baseOccupied = 330;

    const relevantData = data.filter((item) => item.fecha === selectedDate);

    const entradas = relevantData.filter((i) =>
      i.estado?.includes("Entrada")
    ).length;

    const salidas = relevantData.filter((i) =>
      i.estado?.includes("Salida")
    ).length;

    const pendientes = relevantData.filter((i) =>
      i.estado?.includes("Pendiente")
    ).length;

    const occupied = baseOccupied + entradas - salidas;
    const available = capacity - occupied;
    const active = occupied + pendientes + 4;

    return {
      capacity,
      available,
      occupied,
      active,
      activeTrend: entradas,
    };
  }, [data, selectedDate]);

  return (
    <MainLayout>

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-slate-500 text-sm">
              Estado del recinto en tiempo real
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-100 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <StatCard title="CAPACITY" value={stats.capacity} icon={LayoutGrid} />
          <StatCard title="AVAILABLE" value={stats.available} icon={CheckCircle2} />
          <StatCard title="OCCUPIED" value={stats.occupied} icon={Car} />
          <StatCard title="ACTIVE" value={stats.active} icon={Radio} />
        </div>

        {/* CONTENT */}
        <div className="flex gap-6">
          <div className="w-[320px]">
            <QuickActions onOpenModal={handleOpenModal} />
            <VolumeChart
              data={chartData}
              activeBar={activeBar}
              onBarSelect={setActiveBar}
            />
          </div>

          <div className="flex-1">
            <RecentActivity data={data} />
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