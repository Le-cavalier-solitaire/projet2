import React, { useEffect, useState } from "react";
import axios from "axios";
import EditQuizzModal from "./EditQuizzModal";
import RegistrationQuizzModal from "./RegistrationQuizzModal";
import "../App.css";

const TableQuizz = () => {
  const [quizs, setQuizs] = useState([]);

  function getQuiz() {
    axios("http://localhost:3000/quiz?_sort=name&_order=desc")
      .then((res) => {
        setQuizs(res.data);
      })
      .catch((error) => {
        alert("Unable to get quiz");
      });
  }

  useEffect(() => {
    getQuiz();
  }, []);

  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:3000/quiz/${id}`)
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
        <h1 className="text-2xl font-bold">Gestion des Quizs</h1>

        <RegistrationQuizzModal />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "id",
                "Name",
                "Description",
                "AuthorId",
                "BranchId",
                "Create_At",
                "Start_Date",
                "End_Date",
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
            {quizs.map((quiz) => {
              return (
                <tr key={quiz.id}>
                  <td className="px-6 py-4">{quiz.id}</td>
                  <td className="px-6 py-4">{quiz.name}</td>
                  <td className="px-6 py-4">{quiz.description}</td>
                  <td className="px-6 py-4">{quiz.authorId}</td>
                  <td className="px-6 py-4">{quiz.branchId}</td>
                  <td className="px-6 py-4">{quiz.createAt}</td>
                  <td className="px-6 py-4">{quiz.startDate}</td>
                  <td className="px-6 py-4">{quiz.endDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <EditQuizzModal quiz={quiz} />

                      <button
                        style={{
                          backgroundColor: "oklch(0.505 0.213 27.518)",
                          borderRadius: "5px",
                          boxShadow:"0px 6px 6px black"
                        }}
                        onClick={() => deleteUser(quiz.id)}
                        className="text-white"
                      >
                        Supprimer
                      </button>

                      <button
                        style={{
                          backgroundColor: "oklch(0.527 0.154 150.069)",
                          borderRadius: "5px",
                          boxShadow:"0px 6px 6px black"
                        }}
                        onClick={() => deleteUser(quiz.id)}
                        className="text-white"
                      >
                        Add_Questions
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

export default TableQuizz;
