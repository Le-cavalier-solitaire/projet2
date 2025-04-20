// App.tsx

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './DashMainContent';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("users")) {
      navigate("/login"); 
    }
  });
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
 

export default Dashboard;