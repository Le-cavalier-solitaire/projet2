import React, { useEffect, useState } from "react";
import RegistrationModal from "./RegistrationBranch";
import axios from "axios";
import { Link } from "react-router-dom";
import EditUserModal from "./EditUserModal";

const TableUser = () => {
  const [branch, setBranch] = useState([]);

  function getBranch() {
    axios("http://localhost:3000/branch?_sort=name&_order=desc")
      .then((res) => {
        setBranch(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

  useEffect(() => {
    getBranch();
  }, []);

  const deleteBranch = (id) => {
    axios
      .delete(`http://localhost:3000/branch/${id}`)
      .then(() => {
        // setUsers([]);
        // alert("User has already delete");
      })
      .catch((error) => {
        alert("Unable to delete User");
      });
  };

  return (
    <main className="ml-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Branches</h1>

        <RegistrationModal />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["id", "Nom"].map((header, index) => (
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
            {branch.map((item) => {
              return (
                <tr key={branch.id}>
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <EditUserModal item={item} />

                      <button
                        onClick={() => deleteBranch(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
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
