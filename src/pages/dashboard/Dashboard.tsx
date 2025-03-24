// App.tsx

import { useState } from 'react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed right-4 bottom-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} />

      <MainContent />
    </div>
  );
};

// Sidebar.tsx
interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => (
  <aside
    className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform transition duration-200 ease-in-out z-50 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } md:translate-x-0`}
  >
    <div className="flex items-center space-x-2 px-4">
      <i className="fas fa-graduation-cap text-2xl text-blue-400"></i>
      <span className="text-2xl font-bold">EduManage</span>
    </div>
    <nav className="space-y-2">
      {[
        { icon: 'fa-home', text: 'Tableau de bord' },
        { icon: 'fa-book-open', text: 'Cours' },
        { icon: 'fa-tasks', text: 'Devoirs' },
        { icon: 'fa-chart-bar', text: 'Statistiques' },
        { icon: 'fa-calendar-alt', text: 'Calendrier' },
        { icon: 'fa-users', text: 'Étudiants' },
      ].map((item, index) => (
        <a
          key={index}
          href="#"
          className={`flex items-center space-x-2 py-3 px-4 ${
            index === 0 ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <i className={`fas ${item.icon}`}></i>
          <span>{item.text}</span>
        </a>
      ))}
    </nav>
  </aside>
);

// MainContent.tsx
const MainContent = () => (
  <main className="flex-1 md:ml-64">
    <Header />
    <StatsGrid />
    <ChartsSection />
    <Timetable />
  </main>
);

// Header.tsx
const Header = () => (
  <header className="bg-white shadow-sm">
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord</h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Année scolaire 2023/2024
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <i className="fas fa-bell"></i>
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">Prof. Dupont</span>
        </div>
      </div>
    </div>
  </header>
);

// StatsGrid.tsx
const StatsGrid = () => {
  const stats = [
    { title: 'Étudiants inscrits', value: '1,234', icon: 'users', color: 'green' },
    { title: 'Devoirs soumis', value: '89%', icon: 'clipboard-check', color: 'blue' },
    { title: 'Moyenne générale', value: '14.5/20', icon: 'chart-line', color: 'purple' },
    { title: 'Absences', value: '5.2%', icon: 'exclamation-triangle', color: 'red' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

// StatCard.tsx
interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'red';
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-full`}>
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

// ChartsSection.tsx
const ChartsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Performance des étudiants</h3>
      <div className="h-64 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-center h-full text-gray-400">
          <i className="fas fa-chart-area text-4xl"></i>
        </div>
      </div>
    </div>
    <RecentGrades />
  </div>
);

// RecentGrades.tsx
const RecentGrades = () => {
  const grades = [
    { student: 'Marie Curie', subject: 'Physique', grade: '18/20', color: 'green' },
    { student: 'Albert Einstein', subject: 'Mathématiques', grade: '16/20', color: 'blue' },
    { student: 'Ada Lovelace', subject: 'Informatique', grade: '19/20', color: 'purple' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Notes récentes</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Étudiant</th>
              <th className="pb-3">Matière</th>
              <th className="pb-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">{grade.student}</td>
                <td>{grade.subject}</td>
                <td>
                  <span className={`bg-${grade.color}-100 text-${grade.color}-800 px-2 py-1 rounded`}>
                    {grade.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Timetable.tsx
const Timetable = () => {
  const days = [
    { day: 'Lundi', course: 'Maths 09h-11h', color: 'blue' },
    { day: 'Mardi', course: 'Physique 14h-16h', color: 'green' },
    { day: 'Mercredi', course: 'Informatique 10h-12h', color: 'purple' },
    { day: 'Jeudi', course: 'Chimie 08h-10h', color: 'yellow' },
    { day: 'Vendredi', course: 'Révision 15h-17h', color: 'pink' },
  ];

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Emploi du temps</h3>
          <button className="text-blue-600 hover:text-blue-800">
            Voir tout <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          {days.map((day, index) => (
            <div key={index} className={`p-3 bg-${day.color}-50 rounded-lg`}>
              <p className="font-medium">{day.day}</p>
              <p className="text-sm text-gray-500">{day.course}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;