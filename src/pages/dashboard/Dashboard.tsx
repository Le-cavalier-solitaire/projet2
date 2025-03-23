import React from 'react';

interface User {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  role: string;
  email: string;
  avatarUrl: string;
}

interface StatItem {
  title: string;
  value: string | number;
  color?: string;
}

const Dashboard = () => {
  // Données exemple
  const stats: StatItem[] = [
    { title: 'Total Utilisateurs', value: '1,234' },
    { title: 'Actifs', value: '1,024', color: 'text-green-500' },
    { title: 'Inactifs', value: '210', color: 'text-red-500' },
    { title: 'Nouveaux (30j)', value: '84' }
  ];

  const users: User[] = [
    {
      id: 1,
      name: 'Jean Dupont',
      status: 'active',
      role: 'Administrateur',
      email: 'jean.dupont@example.com',
      avatarUrl: 'https://i.pravatar.cc/40?img=1'
    }
    // Ajouter plus d'utilisateurs ici
  ];

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="bg-white w-64 fixed h-full px-4 py-6">
        <div className="flex items-center space-x-2 mb-8">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Utilisateurs</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Ajouter utilisateur
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
              <p className={`text-2xl font-bold ${stat.color || ''}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Nom', 'Statut', 'Rôle', 'Email', 'Actions'].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatarUrl}
                        alt={user.name}
                      />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.email}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;