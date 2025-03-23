import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Testdashboard from "./components/TestDashboard.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import BranchList from "./components/BranchList.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Testdashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/BranchSelector",
    element: <BranchList />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />{" "}
  </StrictMode>
);
