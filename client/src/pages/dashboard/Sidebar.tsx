import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import QuizIcon from "@mui/icons-material/Quiz";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotesIcon from "@mui/icons-material/Notes";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import LogoutIcon from "@mui/icons-material/Logout";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import SchoolIcon from "@mui/icons-material/School";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [tableMenu, setTableMenu] = useState([
    {
      icon: DashboardIcon,
      text: "Dashboard",
      autorised: "any",
      path: "",
      status: false,
    },
    {
      icon: RecentActorsIcon,
      text: "User List",
      autorised: "Administrateur",
      path: "userlist",
      status: false,
    },
    {
      icon: CloseFullscreenIcon,
      text: "Branch List",
      autorised: "Teacher",
      path: "",
      status: false,
    },
    {
      icon: BubbleChartIcon,
      text: "Add Quiz",
      autorised: "Teacher",
      path: "quizzList",
      status: false,
    },
    {
      icon: QuizIcon,
      text: "View Previously Quiz",
      autorised: "Student",
      path: "MyQuizz",
      status: false,
    },
    {
      icon: NotesIcon,
      text: "Results",
      autorised: "any",
      path: "",
      status: false,
    },
    {
      icon: BarChartIcon,
      text: "Statistics",
      autorised: "any",
      path: "",
      status: false,
    },
    {
      icon: CircleNotificationsIcon,
      text: "Notifications",
      autorised: "any",
      path: "",
      status: false,
    },
  ]);

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

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform transition duration-200 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex items-center space-x-1">
        <SchoolIcon
          style={{ height: "64px", width: "64px" }}
          className="text-amber-50"
        />
        <span className="text-2xl text-amber-50 font-bold">Cabinfo!_Edu</span>
      </div>
      <nav className="space-y-2 border-t-2 border-amber-100">
        {tableMenu.map((item, index) => (
          <Link to={`/${item.path}`}>
            <p
              key={index}
              className={`flex text-white items-center space-x-2 py-3 px-4 transition-colors duration-200 ${
                item.status
                  ? "bg-gray-700 font-bold text-white"
                  : "hover:bg-gray-700 text-white"
              } ${
                item.autorised === user?.role || item.autorised === "any"
                  ? ""
                  : "hidden"
              }`}
              onClick={() => handleClick(item.text)}
            >
              <item.icon />
              <span>{item.text}</span>
            </p>
          </Link>
        ))}

        <button
          style={{
            backgroundColor: "oklch(0.505 0.213 27.518)",
            borderRadius: "3px",
            width: "100%",
          }}
          className="flex items-center mt-10 text-white space-x-2 py-3 px-4 rounded hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogoutIcon />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
