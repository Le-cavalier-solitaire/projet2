import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import DetailsResultDraw from "./DetailsResultDraw";
import toast from "react-hot-toast";
import DetailsQuizModal from "../quizz/DetailsQuizModal";
import { Link } from "react-router-dom";
import TeacherViewResultDetails from "./TeacherViewResultDetails";
// import DetailsResultDraw from "./DetailsResultDraw";

// Définir le type des résultats utilisateur
interface Question {
  quizId: string;
  id: string;
  mainQuestion: string;
  choices: string[];
  correctAnswer: number;
  marks: number;
  userAnswer: number;
}

interface UserResult {
  name: string;
  score: number;
  percent: number;
  feedback: string;
  quizQuestions: Question[];
}

export default function TableResult() {
  const { user, isLoading } = useAuth();
  const [resultOfUSer, setResultOfUSer] = useState<UserResult[]>([]);
  const [quizs, setQuizs] = useState([]);

  const [branchs, setBranch] = useState([]);

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

  function getBranch() {
    axios("http://localhost:3000/api/branchs")
      .then((res) => {
        setBranch(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get branch");
      });
  }

  useEffect(() => {
    getBranch();
  }, []);

  // Récupérer les résultats et le statut du quiz avec meilleure gestion des erreurs
  useEffect(() => {
    const fetchResults = async () => {
      if (!user?.id) return;

      try {
        // Vérifier si l'utilisateur a fait ce quiz
        const userResult = await axios
          .get(`http://localhost:3000/api/results/${user.id}`)
          .then((res) => {
            setResultOfUSer(res.data);
            return res.data;
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              console.error(
                "Erreur lors de la vérification du statut du quiz:",
                error
              );
            } else {
              console.error(
                "Erreur lors de la vérification du statut du quiz:",
                error
              );
            }
            return null;
          });
      } catch (error) {
        console.error("Erreur lors de la récupération des résultats:", error);
        setResultOfUSer([]);
      }
    };
    fetchResults();
  }, [user?.id]);
  console.log(resultOfUSer);

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
  return (
    <main className="p-8 md:p-20 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800">
          Résultats de session
        </h1>
      </div>

      {user?.role == "Student" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte de performance (1/3) */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-full lg:col-span-1">
            <h3 className="text-xl font-semibold mb-6 text-purple-700">
              Performance mensuelle de l'étudiant
            </h3>
            <div className="h-64 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <i className="fas fa-chart-area text-5xl text-gray-300"></i>
            </div>
          </div>

          {/* Tableau des résultats (2/3) */}
          <div className="bg-white p-8 rounded-2xl shadow-md lg:col-span-2">
            <h3 className="text-xl font-semibold mb-6 text-purple-700">
              Notes récentes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[45vw] text-sm">
                <thead>
                  <tr className="text-gray-500 border-b text-left">
                    <th className="pb-4">Matière</th>
                    <th className="pb-4">Note</th>
                    <th className="pb-4">percent</th>
                    <th className="pb-4">Feedback</th>
                    <th className="pb-4">Voir mes choix</th>
                  </tr>
                </thead>
                <tbody>
                  {resultOfUSer.map((result, index) => (
                    <tr
                      key={index}
                      className="border-b font-semibold hover:bg-purple-50 transition text-[16px]"
                    >
                      <td className="py-3 text-gray-700">{result.name}</td>
                      <td>
                        <span className="text-green-800 px-3 py-1 rounded font-semibold">
                          {result.score}
                        </span>
                      </td>
                      <td>
                        <span className="text-green-800 px-3 py-1 rounded font-semibold">
                          {result.percent}%
                        </span>
                      </td>
                      <td>
                        <span className="text-green-800 px-3 py-1 rounded font-semibold">
                          {result.feedback}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">
                        <DetailsResultDraw result={result} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {user?.role == "Teacher" && (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 font-extrabold">
              <tr>
                {[
                  "Name",
                  "Description",
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
                    <td className="px-6 py-4">{quiz?.createAt}</td>
                    <td className="px-6 py-4">{quiz?.startDate}</td>
                    <td className="px-6 py-4">{quiz?.endDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link to={"/TeacherViewResult"} />
                        <TeacherViewResultDetails
                          quiz={quiz}
                          user={user}
                          // quizs={quizs}
                          // setQuizs={setQuizs}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
