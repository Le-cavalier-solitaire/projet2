import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import axios from "axios";

const StatsGrid = () => {
  const [usersTeacher, setUsersTeacher] = useState([]);
  const [usersParents, setUsersParents] = useState([]);
  const [usersAdmin, setUsersAdmin] = useState([]);
  const [usersStudent, setUsersStudent] = useState([]);

  function getTeacher() {
    axios("http://localhost:3000/users?role=Teacher")
      .then((res) => {
        setUsersTeacher(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

  function getParent() {
    axios("http://localhost:3000/users?role=Parent")
      .then((res) => {
        setUsersParents(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

  function getAdmin() {
    axios("http://localhost:3000/users?role=Administrateur")
      .then((res) => {
        setUsersAdmin(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

  function getStudent() {
    axios("http://localhost:3000/users?role=Student")
      .then((res) => {
        setUsersStudent(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

  useEffect(() => {
    getTeacher();
  }, []);

  useEffect(() => {
    getParent();
  }, []);

  useEffect(() => {
    getAdmin();
  }, []);

  useEffect(() => {
    getStudent();
  }, []);

  const stats = [
    {
      title: "Students Accounts",
      value: usersStudent.length,
      icon: "users",
      color: "green",
    },
    {
      title: "Parents Accounts",
      value: usersParents.length,
      icon: "clipboard-check",
      color: "blue",
    },
    {
      title: "Teachers Accounts",
      value: usersTeacher.length,
      icon: "chart-line",
      color: "purple",
    },
    {
      title: "AdMins Accounts",
      value: usersAdmin.length,
      icon: "exclamation-triangle",
      color: "red",
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
