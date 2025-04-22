import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/login/Login.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import UserDash from "./pages/dashboard/UserDash.tsx";
import { Toaster } from "react-hot-toast";
import QuizzList from "./pages/quizz/QuizzList.tsx";
import MyQuizz from "./pages/quizzActiv/MyQuizz.tsx";
import DoQuizz from "./pages/quizzActiv/DoQuizz.tsx";
import BranchList from "./pages/branch/BranchList.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/userlist",
    element: <UserDash />,
  },
  {
    path: "/branch",
    element: <BranchList />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/quizzList",
    element: <QuizzList />,
  },
  {
    path: "/MyQuizz",
    element: <MyQuizz />,
  },
  {
    path: "/quizStart/:id",
    element: <DoQuizz />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />{" "}
  </StrictMode>
);
