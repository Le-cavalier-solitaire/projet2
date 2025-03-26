import React from 'react'

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

export default StatCard
