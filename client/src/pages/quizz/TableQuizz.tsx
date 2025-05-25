import React, { useEffect, useState } from "react";
import axios from "axios";
import EditQuizzModal from "./EditQuizzModal";
import RegistrationQuizzModal from "./RegistrationQuizzModal";
import { DeleteForever } from "@mui/icons-material";
import "../App.css";
import AddQuests from "./AddQuests";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DetailsQuizModal from "./DetailsQuizModal";
import { Tooltip } from "@mui/material";

const TableQuizz = () => {
  const [quizs, setQuizs] = useState([]);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  function getQuiz() {
    if (!user?.id) {
      console.log("Pas d'ID utilisateur disponible");
      return;
    }

    console.log("Récupération des quizs pour l'utilisateur:", user.id);

    axios(`http://localhost:3000/api/quiz/authorId/${user.id}`)
      .then((res) => {
        console.log("Quizs reçus:", res.data);
        setQuizs(res.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des quizs:", error);
        toast.error("Impossible de récupérer les quizs");
      });
  }

  useEffect(() => {
    if (user?.id && user?.role == "Teacher") {
      getQuiz();
    }
  }, [user?.id]);

  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:3000/api/deleteQuiz/${id}`)
      .then(() => {
        setQuizs(quizs.filter((client) => client.id !== id));
        toast.success("Quiz supprimé avec succès");
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Impossible de supprimer le quiz");
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
                <tr key={quiz?.id}>
                  <td className="px-6 py-4">{quiz?.name}</td>
                  <td className="px-6 py-4">{quiz?.description}</td>
                  <td className="px-6 py-4">{quiz?.authorId}</td>
                  <td className="px-6 py-4">
                    {quiz?.branchId?.length > 0
                      ? quiz.branchId?.join(", ")
                      : "Aucune branche"}
                  </td>
                  <td className="px-6 py-4">{quiz?.createAt}</td>
                  <td className="px-6 py-4">{quiz?.startDate}</td>
                  <td className="px-6 py-4">{quiz?.endDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {quiz && (
                        <EditQuizzModal
                          quiz={quiz}
                          quizs={quizs}
                          setQuizs={setQuizs}
                        />
                      )}

                      <DetailsQuizModal
                        quiz={quiz}
                        // quizs={quizs}
                        // setQuizs={setQuizs}
                      />
                      <Tooltip title="Delete quiz">
                        <button
                          style={{
                            backgroundColor: "oklch(0.505 0.213 27.518)",
                            borderRadius: "5px",
                            boxShadow: "0px 6px 6px black",
                          }}
                          onClick={() => deleteUser(quiz.id)}
                          className="text-white"
                        >
                          <DeleteForever fontSize="medium" />
                        </button>
                      </Tooltip>
                      {quiz && (
                        <AddQuests
                          quiz={quiz}
                          quizs={quizs}
                          setQuizs={setQuizs}
                        />
                      )}
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
