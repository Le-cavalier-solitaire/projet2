import React from "react";
import StatCard from "./StatCard";

const StatsGrid = () => {
  const stats = [
    {
      title: "Students Accounts",
      value: "1,234",
      icon: "users",
      color: "green",
    },
    {
      title: "Parents Accounts",
      value: "89%",
      icon: "clipboard-check",
      color: "blue",
    },
    {
      title: "Teachers Accounts",
      value: "14.5/20",
      icon: "chart-line",
      color: "purple",
    },
    {
      title: "AdMins Accounts",
      value: "5.2%",
      icon: "exclamation-triangle",
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
