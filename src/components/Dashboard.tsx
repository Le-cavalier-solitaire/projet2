import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("users")) {
      navigate("/login");
    } else {
      const userData = localStorage.getItem("users");
      console.log(userData);
    }
  });
  return (
    <div>
      <div className="min-h-screen">
        <aside className="bg-white w-64 fixed h-full px-4 py-6">
          <div className="flex items-center space-x-2 mb-8">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-xl font-bold">Dashboard</span>
          </div>

          <nav>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-600 p-2 hover:bg-gray-100 rounded"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Utilisateurs</span>
            </a>
          </nav>
        </aside>

        <main className="ml-64 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
            <Link to="/register">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                style={{ backgroundColor: "green" }}
              >
                + Ajouter utilisateur
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">Total Utilisateurs</h3>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">Actifs</h3>
              <p className="text-2xl font-bold text-green-500">1,024</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">Inactifs</h3>
              <p className="text-2xl font-bold text-red-500">210</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">Nouveaux (30j)</h3>
              <p className="text-2xl font-bold">84</p>
            </div>
          </div>

          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span>Jean Dupont</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Actif
                    </span>
                  </td>
                  <td className="px-6 py-4">Administrateur</td>
                  <td className="px-6 py-4">jean.dupont@example.com</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        Éditer
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
