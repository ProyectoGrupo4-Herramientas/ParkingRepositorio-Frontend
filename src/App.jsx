import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import QuickActions from './components/QuickActions';
import VolumeChart from './components/VolumeChart';
import RecentActivity from './components/RecentActivity';
import Modal from './components/Modal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { accessData as initialData } from './data';
import { LayoutGrid, CheckCircle2, Car, Radio, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';

function App() {
  const [data, setData] = useLocalStorage('parkcontrol_data_v2', initialData);


  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('OCR');
  
  // New States for Filtering
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Default to current hour if within 6 AM - 6 PM, else 2 (8 AM)
  const currentHour = new Date().getHours();
  const defaultBar = (currentHour >= 6 && currentHour <= 18) ? currentHour - 6 : 2;
  const [activeBar, setActiveBar] = useState(defaultBar);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleAddEntry = (newEntry) => {
    const now = new Date();
    const entry = {
      id: Date.now(),
      fecha: selectedDate, // Add to currently selected date
      hora: format(now, 'hh:mm a'),
      duracion: '--',
      ...newEntry
    };
    
    setData([entry, ...data]);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Calculate chart data dynamically based on the selectedDate
  const chartData = React.useMemo(() => {
    const hours = Array(13).fill(0); // 6 AM to 6 PM (13 bars)
    const dateData = data.filter(item => item.fecha === selectedDate);
    
    dateData.forEach(item => {
      const parts = item.hora.match(/(\d+):(\d+)\s+(AM|PM)/i);
      if (parts) {
        let h = parseInt(parts[1], 10);
        const ampm = parts[3].toUpperCase();
        if (h === 12) h = 0;
        if (ampm === 'PM') h += 12;
        
        const index = h - 6;
        if (index >= 0 && index < 13) {
          hours[index]++;
        }
      }
    });

    const maxCount = Math.max(...hours, 1);
    return hours.map((count) => ({
      height: (count / maxCount) * 100, // percentage for the UI
      label: count > 0 ? count.toString() : "",
      realCount: count
    }));
  }, [data, selectedDate]);

  // Filter Logic for Table
  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      if (item.fecha !== selectedDate) return false;
      
      if (activeBar !== null) {
        let hour24 = 6 + activeBar;
        let ampm = hour24 >= 12 && hour24 < 24 ? 'PM' : 'AM';
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;
        const prefix = `${hour12.toString().padStart(2, '0')}:`;
        if (!item.hora.startsWith(prefix) || !item.hora.includes(ampm)) {
          return false;
        }
      }
      return true;
    });
  }, [data, selectedDate, activeBar]);

  // Determine button text
  const getButtonDateText = () => {
    try {
      if (isToday(parseISO(selectedDate))) return 'Hoy';
      return format(parseISO(selectedDate), 'dd MMM');
    } catch {
      return selectedDate;
    }
  };

  const stats = React.useMemo(() => {
    const capacity = 450;
    const baseOccupied = 330;
    
    const relevantData = data.filter(item => item.fecha === selectedDate);
    const entradas = relevantData.filter(item => item.estado.includes('Entrada')).length;
    const salidas = relevantData.filter(item => item.estado.includes('Salida')).length;
    const pendientes = relevantData.filter(item => item.estado.includes('Pendiente')).length;

    const occupied = baseOccupied + entradas - salidas;
    const available = capacity - occupied;
    const active = occupied + pendientes + 4;

    return {
      capacity,
      available,
      occupied,
      active,
      activeTrend: entradas
    };
  }, [data, selectedDate]);

  const allDayData = React.useMemo(() => {
    return data.filter(item => item.fecha === selectedDate);
  }, [data, selectedDate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-24 p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none mb-2">Resumen</h2>
              <p className="text-[14px] text-slate-500">Estado del recinto en tiempo real para 14 nov. 2023</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative inline-flex">
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="inline-flex items-center px-4 py-2.5 bg-[#f1f5f9] rounded-lg text-sm font-semibold text-slate-600 hover:bg-[#e2e8f0] transition-colors border border-slate-200 pointer-events-none">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {getButtonDateText()}
                </button>
              </div>
              <button onClick={handleRefresh} className="p-2.5 bg-[#f1f5f9] rounded-lg text-slate-600 hover:bg-[#e2e8f0] transition-colors border border-slate-200">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stat Cards - Exact Layout from Image */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="TOTAL CAPACITY" 
              value={stats.capacity} 
              subtitle="Assigned & Guest Spots" 
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
                    <h3 className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">AVAILABLE</h3>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-slate-900">{stats.available}</div>
                  <p className="text-sm text-slate-500 mt-1">24% of total capacity</p>
                </div>
              </div>
            </div>

            <StatCard 
              title="OCCUPIED" 
              value={stats.occupied} 
              subtitle="76% utilization rate" 
              icon={Car} 
            />
            <StatCard 
              title="ACTIVE IN FACILITY" 
              value={stats.active} 
              subtitle="vs last hour" 
              icon={Radio} 
              trend="up"
              trendValue={stats.activeTrend}
            />
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Column */}
            <div className="w-full lg:w-[320px] flex flex-col">
              <QuickActions onOpenModal={handleOpenModal} />
              <VolumeChart activeBar={activeBar} onBarSelect={setActiveBar} data={chartData} />
            </div>

            {/* Right Column */}
            <div className="flex-1">
              <RecentActivity data={filteredData} allDayData={allDayData} />
            </div>

          </div>
          
        </div>
      </main>

      {/* Modal for Interactions */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleAddEntry} 
        type={modalType} 
      />
    </div>
  );
}

export default App;
