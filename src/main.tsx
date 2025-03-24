import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/login/Login.tsx";
import Register from "./pages/register/Register.tsx";
import RegistrationModal from "./pages/dashboard/RegistrationModal.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";

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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />{" "}
  </StrictMode>
);
