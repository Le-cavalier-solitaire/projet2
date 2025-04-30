import React, { useEffect, useState } from "react";
import axios from "axios";
import EditQuizzModal from "./EditQuizzModal";
import RegistrationQuizzModal from "./RegistrationQuizzModal";
import "../App.css";
import AddQuests from "./AddQuests";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const TableQuizz = () => {
  const [quizs, setQuizs] = useState([]);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  function getQuiz() {
    axios("http://localhost:3000/api/quiz")
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
        setQuizs(quizs.filter((client) => client.id !== id));
        toast.success("Quiz has already delete");
      })
      .catch((error) => {
        alert("Unable to delete User");
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("Redirection vers /login car pas d'utilisateur");
    navigate("/login");
    return null;
  }

  return (
    <main className="ml-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Quizs</h1>

        <RegistrationQuizzModal quizs={quizs} setQuizs={setQuizs} />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 font-extrabold">
            <tr>
              {[
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
                  <td className="px-6 py-4">{quiz.name}</td>
                  <td className="px-6 py-4">{quiz.description}</td>
                  <td className="px-6 py-4">{quiz.authorId}</td>
                  <td className="px-6 py-4">{quiz.branchId}</td>
                  <td className="px-6 py-4">{quiz.createAt}</td>
                  <td className="px-6 py-4">{quiz.startDate}</td>
                  <td className="px-6 py-4">{quiz.endDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <EditQuizzModal
                        quiz={quiz}
                        quizs={quizs}
                        setQuizs={setQuizs}
                      />

                      <button
                        style={{
                          backgroundColor: "oklch(0.505 0.213 27.518)",
                          borderRadius: "5px",
                          boxShadow: "0px 6px 6px black",
                        }}
                        onClick={() => deleteUser(quiz.id)}
                        className="text-white"
                      >
                        Supprimer
                      </button>

                      <AddQuests quiz={quiz} />
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
