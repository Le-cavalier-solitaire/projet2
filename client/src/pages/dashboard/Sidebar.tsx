import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import graduation from "../../assets/graduation.png";
import graduation2 from "../../assets/graduation2.png";
import users from "../../assets/users.png";
import questions from "../../assets/questions.png";
import doquiz from "../../assets/do.png";
import results from "../../assets/results.png";
import branchs from "../../assets/branchs.png";
import notifications from "../../assets/notifications.png";
import statistics from "../../assets/statistics.png";
import logout from "../../assets/logout.png";
import dashboard from "../../assets/dashboard.png";

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  icon: string;
  text: string;
  path: string;
  status: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tableMenu, setTableMenu] = useState<MenuItem[]>([
    { icon: dashboard, text: "Dashboard", path: "", status: false },
    { icon: users, text: "User List", path: "userlist", status: false },
    { icon: branchs, text: "Branch List", path: "", status: false },
    { icon: questions, text: "Add Quiz", path: "quizzList", status: false },
    { icon: doquiz, text: "View Quiz", path: "myQuizz", status: false },
    { icon: results, text: "Results", path: "", status: false },
    { icon: statistics, text: "Statistics", path: "", status: false },
    { icon: notifications, text: "Notifications", path: "", status: false },
  ]);

  // Mettre à jour l'élément actif en fonction du chemin actuel
  useEffect(() => {
    const currentPath = location.pathname.substring(1); // Enlever le slash au début
    const updatedMenu = tableMenu.map((item) => ({
      ...item,
      status: item.path === currentPath,
    }));
    setTableMenu(updatedMenu);
  }, [location.pathname]);

  function handleClick(text: string) {
    // Mettre à jour le statut dans le menu
    const newArray = tableMenu.map((menu) => ({
      ...menu,
      status: menu.text === text,
    }));

    setTableMenu(newArray);
    console.log("Menu mis à jour:", newArray);
  }

  return (
    <aside
      className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform transition duration-200 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex  items-center">
        <img src={graduation} height={40} width={40} alt="" />
        <span className="text-2xl font-bold">Cabinfo!_Edu</span>
        <img className="ml-2" src={graduation2} height={40} width={40} alt="" />
      </div>
      <nav className="space-y-2 border-t-4 border-white text-white">
        {tableMenu.map((item, index) => (
          <div key={index}>
            <Link
              to={`/${item.path}`}
              className={`flex text-white items-center space-x-2 py-3 px-4 block transition-colors duration-200 ${
                item.status
                  ? "bg-gray-700 font-bold text-white"
                  : "hover:bg-gray-700 text-white"
              }`}
              onClick={() => handleClick(item.text)}
            >
              <img width={30} height={30} src={item.icon} alt={item.text} />
              <span className="text-white">{item.text}</span>
            </Link>
          </div>
        ))}

        <button
          style={{
            backgroundColor: "oklch(0.505 0.213 27.518)",
            borderRadius: "3px",
            width: "100%",
          }}
          className="flex items-center mt-10 text-white space-x-2 py-3 px-4 rounded hover:bg-gray-700"
          onClick={() => {
            localStorage.removeItem("users");
            navigate("/login");
          }}
        >
          <img height={30} width={30} src={logout} alt="" />
          Log Out
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
