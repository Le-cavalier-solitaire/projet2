import React from "react";

const RecentGrades = () => {
  const grades = [
    {
      student: "Marie Curie",
      subject: "Physique",
      grade: "18/20",
      color: "green",
    },
    {
      student: "Albert Einstein",
      subject: "Mathématiques",
      grade: "16/20",
      color: "blue",
    },
    {
      student: "Ada Lovelace",
      subject: "Informatique",
      grade: "19/20",
      color: "purple",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Notes récentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Étudiant</th>
              <th className="pb-3">Matière</th>
              <th className="pb-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">{grade.student}</td>
                <td>{grade.subject}</td>
                <td>
                  <span
                    className={`bg-${grade.color}-100 text-${grade.color}-800 px-2 py-1 rounded`}
                  >
                    {grade.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentGrades;
