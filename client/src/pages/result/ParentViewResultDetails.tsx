import axios from "axios";
import React, { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import "../../assets/app.css";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";
import DetailsResultDraw from "./DetailsResultDraw";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export default function ParentViewResultDetails({ quizs }) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div>
      {/* Bouton d'ouverture */}
      <Tooltip title="View results of this student²">
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
            <div className="title">Resultats de l'étudiant</div>
          </div>

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
            {quizs.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-md lg:col-span-2">
                <h3 className="text-xl font-semibold mb-6 text-purple-700">
                  Notes récentes
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[35vw] text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b text-left">
                        <th className="pb-4">Matière</th>
                        <th className="pb-4">Note</th>
                        <th className="pb-4">percent</th>
                        <th className="pb-4">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizs.map((result, index) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
