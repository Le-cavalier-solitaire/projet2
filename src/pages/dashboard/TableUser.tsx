import React, { useEffect, useState } from "react";
import RegistrationModal from "./RegistrationModal";
import axios from "axios";
import { Link } from "react-router-dom";

const TableUser = () => {
  const [users, setUsers] = useState([]);

  function getusers() {
    axios("http://localhost:3000/users?_sort=name&_order=desc")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

  useEffect(getusers, []);

  function deleteUser(id) {
    axios
      .delete(`http://localhost:3000/users/${id}`)
      .then(() => {
        setUsers([]);
        alert("User has already delete");
      })
      .catch((error) => {
        alert("Unable to delete User");
      });
  }

  return (
    <main className="ml-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>

        <RegistrationModal/>

        <button
          style={{ background: "blue" }}
          type="button"
          onClick={getusers}
          className="bg-blue-500 ml-3 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["id","Nom","Prenom", "Rôle", "Branch" ,"Birthday" ,"Email", "phone", "Actions"].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    {user.id}
                  </td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.surname}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.brancnId}</td>
                  <td className="px-6 py-4">{user.dob}</td>
                  <td className="px-6 py-4">{user.mail}</td>
                  <td className="px-6 py-4">{user.telephone}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link to={"/edit/" + user.id}> 
                      <button
                       className="text-blue-500 hover:text-red-700">
                        Editer
                      </button>
                      </Link>
                      <button
                      onClick={()=>deleteUser(user.id)}
                       className="text-red-500 hover:text-red-700">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TableUser;
