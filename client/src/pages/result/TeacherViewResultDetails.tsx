import axios from "axios";
import React, { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import "../../assets/app.css";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";
import DetailsResultDraw from "./DetailsResultDraw";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export default function TeacherViewResultDetails({ quiz, user }) {
  const [ResultsScore, setResultsScore] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [combinedData, setCombinedData] = useState([]);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsOpen(open);
    };

  useEffect(() => {
    const fetchResults = async () => {
      if (!quiz?.id) return;

      try {
        // Récupérer tous les résultats du quiz avec les names des users (même si l'utilisateur ne l'a pas fait)
        const allResults = await axios
          .get(
            `http://localhost:3000/api/results/quizId/authorId/${quiz.id}/${user.id}`
          )
          .then((res) => {
            setCombinedData(res.data);
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              return []; // Retourner un tableau vide si aucun résultat
            }
            throw error; // Propager les autres erreurs
          });
        const currentResultsForsuccesRate = allResults.filter(
          (currentResult) => currentResult.status != "pending"
        );
        setResultsScore(currentResultsForsuccesRate);
      } catch (error) {
        console.error("Erreur lors de la récupération des résultats:", error);
        setResultsScore([]);
      }
    };

    fetchResults();
  }, [quiz.id]);
  return (
    <div>
      {/* Bouton d'ouverture */}
      <Tooltip title="View results of this Quiz">
        <button
          style={{
            backgroundColor: "oklch(0.623 0.214 259.815)",
            borderRadius: "5px",
            boxShadow: "0px 6px 6px black",
          }}
          onClick={toggleDrawer(true)}
          className="text-white"
        >
          <RemoveRedEyeIcon fontSize="medium" />
        </button>
      </Tooltip>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "66vw",
            padding: 2,
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        {/* Contenu du modal */}
        {/* En-tête */}
        <div className="w-[140vh] max-w-[140vh] ">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDrawer(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="header">
            <div className="title">Resultats de ce quiz</div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md lg:col-span-2">
            <h3 className="text-xl font-semibold mb-6 text-purple-700">
              Notes récentes
            </h3>
            <div className="overflow-x-auto">
              {combinedData.length > 0 ? (
                <table className="w-full min-w-[45vw] text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b text-left">
                      <th className="pb-4">Étudiant</th>
                      <th className="pb-4">Note</th>
                      <th className="pb-4">Pourcentage</th>
                      <th className="pb-4">Feedback</th>
                      <th className="pb-4">Voir détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedData.map((data, index) =>
                      data.quizResults.map((result, resultIndex) => (
                        <tr
                          key={`${index}-${resultIndex}`}
                          className="border-b font-semibold hover:bg-purple-50 transition text-[16px]"
                        >
                          <td className="py-3 text-gray-700">
                            {data.name} {data.surname}
                          </td>
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
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="text-center p-4">
                  Aucun résultat disponible pour le moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
