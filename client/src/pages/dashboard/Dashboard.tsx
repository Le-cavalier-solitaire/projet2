// App.tsx

import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import StatsGrid from "../../components/dashboard/StatsGrid";
import ChartsSection from "../../components/dashboard/ChartsSection";
import Timetable from "../../components/dashboard/Timetable";

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
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord</h1>
      </div>
      <StatsGrid />
      <ChartsSection />
      <Timetable />
    </main>
  );
};

export default Dashboard;
