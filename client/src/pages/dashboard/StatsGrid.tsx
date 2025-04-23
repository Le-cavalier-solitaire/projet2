import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import axios from "axios";

const StatsGrid = () => {
  const [users, setUsers] = useState([]);

  function getUsers() {
    axios("http://localhost:3000/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

 

  useEffect(() => {
    getUsers();
  }, []);



  const stats = [
    {
      title: "Users Accounts",
      value: users.length,
      icon: "users",
      color: "green",
    },

  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
