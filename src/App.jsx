import { Routes, Route } from "react-router-dom";
import ParkingMapPage from "./pages/ParkingMapPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ParkingMapPage />} />
    </Routes>
  );
}