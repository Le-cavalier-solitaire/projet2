// App.tsx

import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsGrid from "./StatsGrid";
import ChartsSection from "./ChartsSection";
import Timetable from "./Timetable";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Tableau de Bord
            </h1>
            <p className="text-gray-600">
              Bienvenue, {user.name} {user.surname}
            </p>
          </div>
          <StatsGrid />
          <ChartsSection />
          <Timetable />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
