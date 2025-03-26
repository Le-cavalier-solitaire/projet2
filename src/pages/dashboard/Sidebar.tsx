import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [tableMenu, SetTableMenu] = useState([
    { icon: "fa-home", text: "Dashboard", path: "", status: true },
    {
      icon: "fa-book-open",
      text: "User List",
      path: "userlist",
      status: false,
    },
    { icon: "fa-book-open", text: "Branch List", path: "", status: false },
    { icon: "fa-tasks", text: "Add Quiz", path: "", status: false },
    {
      icon: "fa-chart-bar",
      text: "View Previously Quiz",
      path: "",
      status: false,
    },
    { icon: "fa-calendar-alt", text: "Results", path: "", status: false },
    { icon: "fa-users", text: "Statistics", path: "", status: false },
    { icon: "fa-book-open", text: "Notifications", path: "", status: false },
  ]);

  function handleClick(text) {
    const newArray = tableMenu.map((menu) =>
      menu.text === text ? { ...menu, status: !menu.status } : menu
    );
    SetTableMenu(newArray);
    console.log(tableMenu);
  }

  const navigate = useNavigate();

  return (
    <aside
      className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform transition duration-200 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex items-center space-x-2 px-4">
        <i className="fas fa-graduation-cap text-2xl text-blue-400"></i>
        <span className="text-2xl font-bold">Cabinfo!_Edu</span>
      </div>
      <nav className="space-y-2">
        {tableMenu.map((item, index) => (
          <Link to={`/${item.path}`}>
            <p
              onClick={() => handleClick(item.text)}
              key={index}
              className={`flex text-white items-center space-x-2 py-3 px-4 ${
                item.status ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.text}</span>
            </p>
          </Link>
        ))}
        <a
          key=""
          href=""
          className={`flex items-center mt-10 text-white space-x-2 py-3 px-4 rounded bg-red-700 hover:bg-gray-700`}
          style={{ color: "white" }}
        >
          <span
            onClick={() => {
              localStorage.removeItem("users");
              navigate("/login");
            }}
          >
            Log Out
          </span>
        </a>
        <button
          className="flex items-center mt-10 text-white space-x-2 py-3 px-4 rounded bg-red-700 hover:bg-gray-700"
          onClick={() => {
            localStorage.removeItem("users");
            navigate("/login");
          }}
        >
          Log Out
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
