import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import VehicleModal from "../components/VehicleModal";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <Topbar onMenuOpen={() => setSidebarOpen(true)} />

        <main className="mt-16 p-4 sm:p-5 md:p-6 flex-1">
          {children}
        </main>
      </div>

      {/* MODAL GLOBAL */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}