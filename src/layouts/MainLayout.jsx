import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import VehicleModal from "../components/VehicleModal";
import { useParking } from "../context/ParkingContext";

export default function MainLayout({ children, searchQuery, setSearchQuery }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addVehicle } = useParking();

  const handleSaveGlobalVehicle = (newVehicle) => {
    addVehicle({
      placa: newVehicle.plate,
      unidad: newVehicle.unit,
      propietario: newVehicle.owner,
      vehiculoDesc: "",
      tipoOcupante: newVehicle.type === "Residente" ? "residente" : "visitante",
      estado: "activo",
      fechaExpiracion: newVehicle.expiration || null,
      espacioAsignado: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <Topbar
          onMenuOpen={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="mt-16 p-4 sm:p-5 md:p-6 flex-1">{children}</main>
      </div>

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGlobalVehicle}
      />
    </div>
  );
}
