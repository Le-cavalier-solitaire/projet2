import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/login/Login.tsx";
import RegistrationModal from "./pages/dashboard/RegistrationModal.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import UserDash from "./pages/dashboard/UserDash.tsx";
import EditModal from "./pages/dashboard/EditModal.tsx";
import { Toaster } from "react-hot-toast";
import BranchList from "./pages/dashboard/BranchList.tsx";

const router = createBrowserRouter([
  {
    path: "/registration",
    element: <RegistrationModal />,
  },
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/userlist",
    element: <UserDash />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/edit/:id",
    element: <EditModal />,
  },
  {
    path: "/ListeDesBranches",
    element: <BranchList />,
  },

]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />{" "}
  </StrictMode>
);
