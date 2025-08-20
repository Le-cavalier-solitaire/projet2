import { JSX, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import DoQuizz from "./pages/quizzActiv/DoQuizz";
import { Layouts } from "./components/layout/Layout";
import TableBranch from "./pages/branch/TableBranch";
import TableResult from "./pages/result/TableResult";
import TableQuizz from "./pages/quizz/TableQuizz";
import QuizArea from "./pages/quizzActiv/QuizArea";
import TableUser from "./pages/users/TableUser";
import RegistrationModal from "./components/user/RegistrationModal";
import { Provider } from "react-redux";
import { store } from "./store";
import RegistrationBranch from "./components/branch/RegistrationBranchModal";
import { ResetPasswordForm } from "./components/user/ResetPasswordForm";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Composant pour protéger les routes privées
const PrivateRoute = ({ children }: { children: JSX.Element }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;

const App = () => (
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <Router>
        <Routes>
          {/* Routes avec layout */}
          <Route element={<Layouts />}>
            <Route
              path="/result"
              element={
                <PrivateRoute>
                  <TableResult />
                </PrivateRoute>
              }
            />
            <Route
              path="/addUser"
              element={
                <PrivateRoute>
                  <RegistrationModal />
                </PrivateRoute>
              }
            />

            <Route
              path="/addBranch"
              element={
                <PrivateRoute>
                  <RegistrationBranch />
                </PrivateRoute>
              }
            />

            <Route
              path="/branchList"
              element={
                <PrivateRoute>
                  <TableBranch />
                </PrivateRoute>
              }
            />
            <Route
              path="/quizzList"
              element={
                <PrivateRoute>
                  <TableQuizz />
                </PrivateRoute>
              }
            />
            <Route
              path="/quizStart/:id/:status/:userId"
              element={
                <PrivateRoute>
                  <DoQuizz />
                </PrivateRoute>
              }
            />
            <Route
              path="/MyQuizz"
              element={
                <PrivateRoute>
                  <QuizArea />
                </PrivateRoute>
              }
            />
            <Route
              path="/userList/:role"
              element={
                <PrivateRoute>
                  <TableUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Route>
          {/* Route login sans layout */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/" replace /> : <Login />
            }
          />
          <Route
            path="/resetPassword"
            element={
              isAuthenticated() ? (
                <Navigate to="/" replace />
              ) : (
                <ResetPasswordForm />
              )
            }
          />
          {/* Route 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                404 - Page non trouvée
              </div>
            }
          />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(<App />);
