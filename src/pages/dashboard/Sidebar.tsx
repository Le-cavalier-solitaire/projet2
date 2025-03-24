import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => (
  <aside
    className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform transition duration-200 ease-in-out z-50 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0`}
  >
    <div className="flex items-center space-x-2 px-4">
      <i className="fas fa-graduation-cap text-2xl text-blue-400"></i>
      <span className="text-2xl font-bold">EduManage</span>
    </div>
    <nav className="space-y-2">
      {[
        { icon: "fa-home", text: "Tableau de bord" },
        { icon: "fa-book-open", text: "userlist" },
        { icon: "fa-tasks", text: "Devoirs" },
        { icon: "fa-chart-bar", text: "Statistiques" },
        { icon: "fa-calendar-alt", text: "Calendrier" },
        { icon: "fa-users", text: "Étudiants" },
      ].map((item, index) => (
        <Link to={`/${item.text}`}>
          <a
            key={index}
            href={`${item.text}`}
            className={`flex items-center space-x-2 py-3 px-4 ${
              index === 0 ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.text}</span>
          </a>
        </Link>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
