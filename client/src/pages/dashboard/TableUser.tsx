import React, { useEffect, useState } from "react";
import RegistrationModal from "./RegistrationModal";
import axios from "axios";
import { Link } from "react-router-dom";
import EditUserModal from "./EditUserModal";
import toast from "react-hot-toast";
import { DeleteForever } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

interface User {
  id: number;
  name: string;
  surname: string;
  role: string;
  brancnId: string;
  dob: string;
  mail: string;
  telephone: string;
}

const TableUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  function getusers() {
    axios("http://localhost:3000/api/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get user");
      });
  }

  useEffect(() => {
    getusers();
  }, []);

  const deleteUser = (id: number) => {
    axios
      .delete(`http://localhost:3000/api/deleteUser/${id}`)
      .then((response) => {
        setUsers(users.filter((user) => user.id !== id));
        toast.success("Utilisateur supprimé avec succès");
      })
      .catch((error) => {
        alert("Unable to delete User");
      });
  };

  return (
    <main className="ml-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>

        <RegistrationModal users={users} setUsers={setUsers} />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Nom",
                "Prenom",
                "Rôle",
                "Branch",
                "Birthday",
                "Email",
                "phone",
                "Actions",
              ].map((header, index) => (
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
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.surname}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.brancnId}</td>
                  <td className="px-6 py-4">{user.dob}</td>
                  <td className="px-6 py-4">{user.mail}</td>
                  <td className="px-6 py-4">{user.telephone}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <EditUserModal
                        user={user}
                        users={users}
                        setUsers={setUsers}
                      />

                      <Tooltip title="Delete user">
                        <button
                          style={{
                            backgroundColor: "oklch(0.505 0.213 27.518)",
                            borderRadius: "5px",
                            boxShadow: "0px 6px 6px black",
                          }}
                          onClick={() => deleteUser(user.id)}
                          className="text-white"
                        >
                          <DeleteForever fontSize="medium" />
                        </button>
                      </Tooltip>
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
