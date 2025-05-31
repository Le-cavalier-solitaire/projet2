import { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import ResultDashMainContent from "./ResultDashMainContent";

export default function ResultList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen md:flex">
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed right-4 bottom-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} />

      <ResultDashMainContent />
    </div>
  );
}
