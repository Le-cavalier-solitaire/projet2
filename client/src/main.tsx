import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login/Login.tsx";
import RegistrationModal from "./pages/dashboard/RegistrationModal.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import UserDash from "./pages/dashboard/UserDash.tsx";
import EditModal from "./pages/dashboard/EditModal.tsx";
import { Toaster } from "react-hot-toast";
import QuizzList from "./pages/quizz/QuizzList.tsx";
import MyQuizz from "./pages/quizzActiv/MyQuizz.tsx";
import DoQuizz from "./pages/quizzActiv/DoQuizz.tsx";
import BranchList from "./pages/branch/BranchList.tsx";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Vérification de l'authentification, token:", token);
  return token !== null && token !== undefined && token !== "";
};

const App = () => {
  const [users, setUsers] = useState([]);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: isAuthenticated() ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/registration",
      element: <RegistrationModal users={users} setUsers={setUsers} />,
    },
    {
      path: "/",
      element: isAuthenticated() ? (
        <Dashboard />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/userlist",
      element: isAuthenticated() ? (
        <UserDash />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/branch",
      element: isAuthenticated() ? (
        <BranchList />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/quizzList",
      element: isAuthenticated() ? (
        <QuizzList />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/MyQuizz",
      element: isAuthenticated() ? (
        <MyQuizz />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/quizStart/:id/:status/:userId",
      element: isAuthenticated() ? (
        <DoQuizz />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
  ]);

  return (
    <StrictMode>
      <Toaster />
      <RouterProvider router={router} />
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
