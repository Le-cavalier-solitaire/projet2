import React from "react";
import RecentGrades from "./RecentGrades";

const ChartsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Performance des étudiants</h3>
      <div className="h-64 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-center h-full text-gray-400">
          <i className="fas fa-chart-area text-4xl"></i>
        </div>
      </div>
    </div>
    <RecentGrades />
  </div>
);

export default ChartsSection;
