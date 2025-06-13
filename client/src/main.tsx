import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Login from "./pages/login/Login.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import { Toaster } from "react-hot-toast";
import DoQuizz from "./pages/quizzActiv/DoQuizz.tsx";
import { Layout } from "./components/layout/Layout.tsx";
import TableBranch from "./pages/branch/TableBranch.tsx";
import TableResult from "./pages/result/TableResult.tsx";
import TableQuizz from "./pages/quizz/TableQuizz.tsx";
import QuizArea from "./pages/quizzActiv/QuizArea.tsx";
import TableUser from "./pages/users/TableUser.tsx";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Vérification de l'authentification, token:", token);
  return token !== null && token !== undefined && token !== "";
};

const App = () => {
  return (
    <StrictMode>
      <Toaster />
      <Router>
        <Routes>
          {/* Route avec layout (Sidebar + Header) */}
          <Route element={<Layout />}>
            <Route
              path="/result"
              element={
                isAuthenticated() ? (
                  <TableResult />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/branch"
              element={
                isAuthenticated() ? (
                  <TableBranch />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/quizzList"
              element={
                isAuthenticated() ? (
                  <TableQuizz />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/quizStart/:id/:status/:userId"
              element={
                isAuthenticated() ? (
                  <DoQuizz />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/MyQuizz"
              element={
                isAuthenticated() ? (
                  <QuizArea />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/userList"
              element={
                isAuthenticated() ? (
                  <TableUser />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated() ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* ... autres routes */}
          </Route>
          {/* Routes sans layout (login, etc.) */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/" replace /> : <Login />
            }
          />
        </Routes>
      </Router>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
