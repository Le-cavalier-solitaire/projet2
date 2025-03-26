import React from "react";
import Header from "./Header";
import StatsGrid from "./StatsGrid";
import ChartsSection from "./ChartsSection";
import Timetable from "./Timetable";

const MainContent = () => (
  <main className="flex-1 md:ml-64">
    <Header />
    <StatsGrid/>
    <ChartsSection />
    <Timetable />
  </main>
);

export default MainContent;
