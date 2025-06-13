import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

export const Layout = () => {
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
      <main className="flex-1 md:ml-64">
        <Header />
        <Outlet /> {/* Ici s'afficheront les pages */}
      </main>
      <div className="main-content">
        <div className="content-area"></div>
      </div>
    </div>
  );
};
