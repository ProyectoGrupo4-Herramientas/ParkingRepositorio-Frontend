import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

type Props = { children: React.ReactNode };

export default function MainLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-[260px] flex flex-col min-h-screen">
        <Topbar onMenuOpen={() => setSidebarOpen(true)} />
        <main className="mt-16 p-4 sm:p-5 md:p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}