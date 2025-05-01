import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../../assets/app.css";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";

const DetailsQuizModal = ({ quiz }) => {
  const [isOpen, setIsOpen] = useState(false);
  const quizQuestions = quiz?.quizQuestions || [];

  // Gestion de la touche Échap

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="bg-green h-auto">
      {/* Bouton d'ouverture */}
      <Tooltip title="Question info">
        <button
          style={{
            backgroundColor: "oklch(0.623 0.214 259.815)",
            borderRadius: "5px",
            boxShadow: "0px 6px 6px black",
          }}
          onClick={openModal}
          className="text-white"
        >
          <InfoIcon fontSize="medium" />
        </button>
      </Tooltip>

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        className={`fixed inset-0 bg-opacity-50 flex items-center z-50 justify-center ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="w-[130vh] max-w-[130vh] bg-white rounded-lg shadow-xl p-6 mx-4 min-h-[30vh] max-h-[90vh] overflow-y-auto">
          {/* En-tête */}
          <div className="w-[140vh] max-w-[140vh] paper-sheet">
            <div className="flex justify-end mb-4">
              <button
                onClick={closeModal}
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
              <div className="metadata">
                <span>Nom: __________________</span>
                <span>Date: __________________</span>
              </div>
            </div>

            {quizQuestions.length > 0 ? (
              quizQuestions.map((q, qIndex) => (
                <div key={qIndex} className="question-paper">
                  <div className="question-number flex justify-between items-center">
                    <span>Question {qIndex + 1}</span>
                    <strong className="text-right">{q.marks}pts(s)</strong>
                  </div>
                  <div className="question-text text-left">
                    {q.mainQuestion}
                  </div>

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
                sachez que ceci n'est qu'une representation logique du quiz que
                vous avez crée!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsQuizModal;
