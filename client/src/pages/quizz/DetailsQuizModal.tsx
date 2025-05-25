import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Drawer } from "@mui/material";
import "../../assets/app.css";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";

const DetailsQuizModal = ({ quiz }) => {
  const [isOpen, setIsOpen] = useState(false);
  const quizQuestions = quiz?.quizQuestions || [];

  // Gestion de la touche Échap

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
      <Tooltip title="View details">
        <button
          style={{
            backgroundColor: "oklch(0.623 0.214 259.815)",
            borderRadius: "5px",
            boxShadow: "0px 6px 6px black",
          }}
          onClick={toggleDrawer(true)}
          className="text-white"
        >
          <InfoIcon fontSize="medium" />
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
        <div className="w-[140vh] max-w-[140vh] paper-sheet">
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
            <div className="title">QUESTIONNAIRE</div>
          </div>

          {quizQuestions.length > 0 ? (
            quizQuestions.map((q, qIndex) => (
              <div key={qIndex} className="question-paper">
                <div className="question-number flex justify-between items-center">
                  <span>Question {qIndex + 1}</span>
                  <strong className="text-right">{q.marks}pts(s)</strong>
                </div>
                <div className="question-text text-left">{q.mainQuestion}</div>

                <div className="options-paper">
                  {q.choices.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className={`option-paper text-left ${
                        q.correctAnswer === oIndex ? "correct-answer" : ""
                      }`}
                    >
                      <span className="option-letter"></span>
                      <span className="ml-2">{option}</span>
                      {q.correctAnswer === oIndex && (
                        <div className="correction-note">
                          [Réponse correcte]
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4">
              Aucune question n'a été ajoutée à ce quiz.
            </div>
          )}

          <div className="footer">
            <div className="instructions">
              NB: sachez que ceci n'est qu'une representation logique du quiz
              que vous avez crée!
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DetailsQuizModal;
