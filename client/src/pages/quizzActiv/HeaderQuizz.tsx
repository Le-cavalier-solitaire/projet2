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
          <h1 className="text-2xl font-bold text-gray-800">Quiz Session</h1>
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
