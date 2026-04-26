import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ParkingMapPage from "./pages/ParkingMapPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/parking" element={<ParkingMapPage />} />
    </Routes>
  );
}