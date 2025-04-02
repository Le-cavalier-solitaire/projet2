import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ShutterSpeedRoundedIcon from "@mui/icons-material/ShutterSpeedRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import AdsClickRoundedIcon from "@mui/icons-material/AdsClickRounded";

function AddQuests({ quiz }) {
  const [quizQuestions, setQuizQuestions] = useState([
    { id: 1, mainQuestion: "" },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    authorId: "",
    branchId: "",
    createAt: "",
    startDate: "",
    endDate: "",
  });

  function addNewQuestion() {
    const newQuestion = { id: 2, mainQuestion: "" };
    setQuizQuestions([...quizQuestions, newQuestion]);
  }

  function deleteQuestion(SingleQuestion) {
    const newQuizQuestion = [...quizQuestions];
    setQuizQuestions(newQuizQuestion.filter((quiz) => quiz !== SingleQuestion));
  }
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:3000/quiz", { ...data })
      .then((res) => {
        console.log({ res });
        toast.success("Quizz Added Successfuly!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("une erreur est survenue");
      });
  }
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
      <button
        onClick={openModal}
        style={{
          backgroundColor: "green",
          borderRadius: "5px",
          boxShadow: "0px 6px 6px black",
        }}
        className=" text-white"
      >
        Add_Quests
      </button>

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-transparent-pink-500 bg-opacity-50 flex items-center justify-center ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4">
          {/* En-tête */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Build Questions
            </h2>
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

          <div className="poopins flex flex-col px-24 mt h-auto">
            <div className="justify-between items-center my-12 flex poopins">
              <div className="flex gap-2 items-center">
                <CodeRoundedIcon
                  style={{ width: "65px", height: "55px" }}
                  className="flex justify-center text-white bg-green-600 w-12 h-12 p-2 rounded-md"
                />
                <span className="text-green-700 font-bold">{quiz.name}</span>
              </div>
              <AdsClickRoundedIcon
                style={{ width: "65px", height: "55px" }}
                className="p-2 px-4 rounded-md text-black h-12"
              />
            </div>
          </div>

          <div className="mt-6 p-3 justify-between border border-green-600 rounded-md">
            <div className="flex gap-2 flex-col w-full">
              <div className="flex gap-2 items-center">
                <div
                  style={{ backgroundColor: "oklch(0.627 0.194 149.214)" }}
                  className="bg-green-700 px-4 py-1 rounded-md text-white"
                >
                  1
                </div>
                <span className="font-bold">Quiz Question :</span>
              </div>
              {quizQuestions.map((singleQuestion, questionIndex) => (
                <div
                  key={questionIndex}
                  className="border ml-5 p-4 mt-4 border-green-500 border-opacity-50-rounded-md"
                >
                  <SingleQuestion questionIndex={questionIndex} />
                  <ChoiceAnswer/>
                  {questionIndex !== 0 && (
                    <HighlightOffRoundedIcon
                      style={{ color: "red", marginTop: "5px" }}
                      onClick={() => {
                        deleteQuestion(singleQuestion);
                      }}
                    />
                  )}
                </div>
              ))}

              <div className="w-full flex justify-center mt-3">
                <button
                  onClick={() => {
                    addNewQuestion();
                  }}
                  style={{ backgroundColor: "oklch(0.627 0.194 149.214)" }}
                  className="p-3 bg-green-600 rounded-md text-white w-210px text-20px"
                >
                  Add a New Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuests;

export function SingleQuestion({ questionIndex }) {
  return (
    <div className="w-full">
      <div className="flex items-center-gap-3">
        <div className="flex gap-2 text-15px border-gary 200">
          <span>Question</span>
          <span>{questionIndex + 1}</span>
        </div>
        <textarea
          placeholder="Your question here..."
          name=""
          id=""
          className="border border-gray-200 rounded-md ml-3 w-full h-10 resize-none text-13px outline-none"
        ></textarea>{" "}
      </div>
    </div>
  );
}

export function ChoiceAnswer() {
  return (
    <div className="flex gap-10 items-center mt-3">
      <div className="text-15px">Choices:</div>
      <div className="border border-gray-200 rounded-md p-4 w-full">
        <div className="flex gap-2 items-center mt-3">
          <span>A:</span>
          <input
            placeholder="Add your first Choice"
            className="border text-13px border-gray-200 p-2 w-full rounded-md outline-none"
          />
        </div>
        <div className="flex gap-2 items-center mt-3">
          <span>B:</span>
          <input
            placeholder="Add your Second Choice"
            className="border text-13px border-gray-200 p-2 w-full rounded-md outline-none"
          />
        </div>
        <div className="w-full flex justify-center mt-3">
          <button className="bg-green-700 border-gray-300 rounded-md text-white w-210px text-13px" style={{backgroundColor:"royalblue "}}>
            Add a new choice
          </button>
        </div>
      </div>
    </div>
  );
}
