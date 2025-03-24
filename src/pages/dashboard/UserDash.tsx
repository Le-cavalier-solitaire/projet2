// App.tsx

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import RegistrationModal from "./RegistrationModal";
import EditModal from "./EditModal";
import { Link } from "react-router-dom";

const UserDash = () => {
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

      <MainContent />
    </div>
  );
};

// MainContent.tsx
const MainContent = () => (
  <main className="flex-1 md:ml-64">
    <Header />
    <StatsGrid />
    <TableUser />
  </main>
);

// Header.tsx
const Header = () => (
  <header className="bg-white shadow-sm">
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage List Of Users
        </h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Année scolaire 2024/2025
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <i className="fas fa-bell"></i>
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">Prof. Dupont</span>
        </div>
      </div>
    </div>
  </header>
);

// StatsGrid.tsx
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
      title: "Admin Accounts",
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

// StatCard.tsx
interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: "green" | "blue" | "purple" | "red";
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-full`}>
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};


const TableUser = () => {
  const [users, setUsers] = useState([]);

  function getusers() {
    axios("http://localhost:3000/users?_sort=name&_order=desc")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

  useEffect(getusers, []);

  function deleteUser(id){
    axios.delete(`http://localhost:3000/users/${id}`)
      .then(() => {
        setUsers([]);
        alert("User has already delete");
      })
      .catch((error) => {
        alert("Unable to delete User");
      });
  }

  return (
    <main className="ml-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>

        <RegistrationModal/>

        <button
          style={{ background: "blue" }}
          type="button"
          onClick={getusers}
          className="bg-blue-500 ml-3 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["id","Nom","Prenom", "Rôle", "Branch" ,"Birthday" ,"Email", "phone", "Actions"].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    {user.id}
                  </td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.surname}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.brancnId}</td>
                  <td className="px-6 py-4">{user.dob}</td>
                  <td className="px-6 py-4">{user.mail}</td>
                  <td className="px-6 py-4">{user.telephone}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link to={"/edit/" + user.id}> 
                      <button
                       className="text-blue-500 hover:text-red-700">
                        Editer
                      </button>
                      </Link>
                      <button
                      onClick={()=>deleteUser(user.id)}
                       className="text-red-500 hover:text-red-700">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default UserDash;
