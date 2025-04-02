import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ShutterSpeedRoundedIcon from "@mui/icons-material/ShutterSpeedRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";

function DoQuizz() {
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
        style={{ background: "green" }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-4"
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Quiz</h2>
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

          <div className="poopins flex flex-col px-24 mt-35px">
            <div className="justify-between flex">
              <div className="flex justify-center bg-green-600 w-12 h-12 p-2 rounded-md">
                <CodeRoundedIcon style={{ width: "45px", height: "35px" }} />
              </div>
              <div className="flex flex-col gap-1 mr-45">
                <h2 className="font-bold text-xl">React Quiz</h2>
                <span className="font-lignt text-sm">5 QUestions</span>
              </div>
              <div className="flex gap-2 items-center">
                <ShutterSpeedRoundedIcon className="text-green-700" />
                <span>00:00:29</span>
              </div>
            </div>
            <div className="mt-10 flex items-center justify-center">
              <form className="space-y-4 justify-center items-center">
                <div className="flex justify-center items-center gap-2">
                  <div className="bg-green-500 flex justify-center items-center rounded-md w-11 h-11">
                    1
                  </div>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Suscipit aliquid velit ipsa?
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-2">
                  <div
                    style={{ backgroundColor: "oklch(0.527 0.154 150.069)" }}
                    className="p-3 ml-11 w-10/12 border border-green-700 rounded-md "
                  >
                    A: blue
                  </div>
                  <div className="p-3 ml-11 w-10/12 border border-green-700 rounded-md ">
                    B: blue
                  </div>
                  <div className="p-3 ml-11 w-10/12 border border-green-700 rounded-md ">
                    C: blue
                  </div>
                  <div className="p-3 ml-11 w-10/12 border border-green-700 rounded-md ">
                    D: blue
                  </div>
                </div>
                <button
                  onClick={(e) => handleSubmit(e)}
                  style={{ backgroundColor: "green" }}
                  type="submit"
                  className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Create Quiz
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoQuizz;
