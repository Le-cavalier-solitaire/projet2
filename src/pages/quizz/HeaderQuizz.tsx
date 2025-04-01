import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export interface Utilisateur {
  id: string;
  name: string;
  surname: string;
  email: string;
  dob: string; // format jour-mois- année
  branchId: string;
  password: string;
  telephone: number;
  role: "student" | "teacher" | "parent" | "Admin";
}

const HeaderQuizz = () => {
  const [userData, setUserData] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("users")) {
      navigate("/login");
    }
  });

  function getDataUsers() {
    const datasUser = localStorage.getItem("users");
    setUserData(JSON.parse(datasUser));
  }

  useEffect(getDataUsers, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Quizs Session</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Année scolaire 2024/2025
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <i className="fas fa-bell"></i>
          </button>
          <div className="flex items-center space-x-1 bg--100 rounded">
            <span className="font-medium text-2xl rounded mr-3">
              {userData.surname} {userData.name}
            </span>
            <span className="text-blue-800 font-medium text-sm">online</span>
            <span
              style={{ marginLeft: "10" }}
              className=" bg-green-100 text-green-600 p-2 rounded-full"
            >
              {""}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderQuizz;
