import React from "react";

const Timetable = () => {
  const days = [
    { day: "Lundi", course: "Maths 09h-11h", color: "blue" },
    { day: "Mardi", course: "Physique 14h-16h", color: "green" },
    { day: "Mercredi", course: "Informatique 10h-12h", color: "purple" },
    { day: "Jeudi", course: "Chimie 08h-10h", color: "yellow" },
    { day: "Vendredi", course: "Révision 15h-17h", color: "pink" },
  ];

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Emploi du temps</h3>
          <button className="text-blue-600 hover:text-blue-800">
            Voir tout <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          {days.map((day, index) => (
            <div key={index} className={`p-3 bg-${day.color}-50 rounded-lg`}>
              <p className="font-medium">{day.day}</p>
              <p className="text-sm text-gray-500">{day.course}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
