import React, { createRef, forwardRef, useLayoutEffect, useRef } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ShutterSpeedRoundedIcon from "@mui/icons-material/ShutterSpeedRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { v4 as uuidv4 } from "uuid";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import AdsClickRoundedIcon from "@mui/icons-material/AdsClickRounded";
import { TextareaAutosize } from "@mui/material";

function AddQuests({ quiz }) {
  const prefixes = ["A", "B", "C", "D"];
  const [quizQuestions, setQuizQuestions] = useState([
    {
      quizId: quiz.id,
      id: uuidv4(),
      mainQuestion: "",
      choices: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
      correctAnswer: "",
    },
  ]);
  const endOfListRef = useRef(null);
  const textAreaRefs = useRef(quizQuestions.map(() => createRef()));
  const [isOpen, setIsOpen] = useState(false);

  function handleInputChange(index, text) {
    const updatequestions = quizQuestions.map((question, i) => {
      if (index == i) {
        return { ...question, mainQuestion: text };
      }
      return question;
    });
    setQuizQuestions(updatequestions);
  }

  function updateChoicesArray(text, choiceIndex, questionIndex) {
    console.log("text", text);
    console.log("choiceindex", choiceIndex);
    console.log("questionindex", questionIndex);
    const updatequestions = quizQuestions.map((question, i) => {
      if (questionIndex == i) {
        const updateChoices = question.choices.map((choice, j) => {
          if (choiceIndex == j) {
            return prefixes[j] + ". " + text;
          } else {
            return choice;
          }
        });
        return { ...question, choices: updateChoices };
      }
      return question;
    });
    setQuizQuestions(updatequestions);
  }

  function addNewQuestion() {
    const lastIdQuizQuestions = quizQuestions.length - 1;
    if (quizQuestions[lastIdQuizQuestions].mainQuestion.trim("").length == 0) {
      toast.error(
        `current area question ${lastIdQuizQuestions + 1} is still empty!`
      );
      textAreaRefs.current[lastIdQuizQuestions].current.focus();
      return;
    }

    for (const choice of quizQuestions[lastIdQuizQuestions].choices) {
      const singleChoice = choice.substring(2);
      if (singleChoice.trim("").length == 0) {
        return toast.error(
          `please ensure that all previous choices are filled out!`
        );
      }
    }

    if (quizQuestions[lastIdQuizQuestions].correctAnswer.length == 0) {
      return toast.error("please ensure to fill out the correct answer");
    }

    const newQuestion = {
      quizId: quiz.id,
      id: uuidv4(),
      mainQuestion: "",
      choices: prefixes.slice(0, 2).map((prefix) => prefix + ""),
      correctAnswer: "",
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
    textAreaRefs.current = [...textAreaRefs.current, createRef()];
  }
  console.log(textAreaRefs);

  function deleteQuestion(SingleQuestion) {
    const newQuizQuestion = [...quizQuestions];

    //filter out the corresponding ref
    const updateRefs = textAreaRefs.current.filter((ref, index) => {
      return quizQuestions[index].id !== SingleQuestion.id;
    });
    textAreaRefs.current = updateRefs;
    setQuizQuestions(
      newQuizQuestion.filter((quiz) => quiz.id !== SingleQuestion.id)
    );
  }

  function updateCorrectAnswer(text, questionIndex) {
    const correctAnswersArray = ["A", "B", "C", "D"];
    const questioncopy = [...quizQuestions];
    questioncopy[questionIndex].correctAnswer =
      correctAnswersArray.indexOf(text);
    setQuizQuestions(questioncopy);
  }

  // useEffect(() => {
  //   if (endOfListRef.current) {
  //     endOfListRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [quizQuestions]);
  console.log(quizQuestions);
  useLayoutEffect(() => {
    if (endOfListRef.current) {
      setTimeout(() => {
        endOfListRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [quizQuestions.length]);

  useEffect(() => {
    //focus the last textarea if it exists
    const lastTextareaIndex = quizQuestions.length - 1;
    if (lastTextareaIndex >= 0) {
      const lastTextarea = textAreaRefs.current[lastTextareaIndex].current;
      if (lastTextarea) {
        lastTextarea.focus();
      }
    }
  }, [quizQuestions.length, textAreaRefs.current]);

  function validateQuizQuestion(quizQuestion) {
    for (let question of quizQuestion) {
      if (!question.mainQuestion.trim()) {
        return { valid: false, message: "please fill in the main questin" };
      }

      if (question.choices.some((choice) => !choice.trim().substring(2))) {
        return { valid: false, message: "please fill in all choice" };
      }

      if (question.correctAnswer.length == 0) {
        return { valid: false, message: "please specify the correct answer" };
      }
    }
    return { valid: true };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const isvalid = validateQuizQuestion(quizQuestions);
    if (isvalid.valid == false) {
      toast.error(isvalid.message);
      return;
    }
    axios
    .patch(`http://localhost:3000/quiz/${quiz.id}`, {quizQuestions })
      .then((res) => {
        console.log({ res });
        toast.success("Questions Added Successfuly!");
        setQuizQuestions([
          {
            quizId: quiz.id,
            id: uuidv4(),
            mainQuestion: "",
            choices: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
            correctAnswer: "",
          },
        ]);
        closeModal();
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
    <div style={{ height: "auto" }} className="bg-green">
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
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div
          style={{ height: "auto" }}
          className="bg-white rounded-lg shadow-xl w-[120vh] max-w-[120vh] p-6 mx-4 max-h-[90vh] overflow-y-auto"
        >
          {/* En-tête */}
          <div
            style={{ height: "auto" }}
            className="flex justify-between items-center"
          >
            <h2 className="text-3xl font-bold text-green-600">
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

          <div
            style={{ height: "auto" }}
            className="poopins flex flex-col px-24 mt h-auto"
          >
            <div className="justify-between items-center my-12 flex poopins">
              <div className="flex gap-2 items-center">
                <AdsClickRoundedIcon
                  style={{ width: "65px", height: "55px" }}
                  className="rounded-md text-green-600 h-12"
                />
                <span className="text-green-600 text-2xl font-bold">
                  {quiz.name}
                </span>
              </div>
              <button
                onClick={(e) => handleSubmit(e)}
                type="submit"
                style={{
                  backgroundColor: "oklch(0.627 0.194 149.214)",
                  boxShadow: "0px 6px 6px 1px black",
                }}
                className="p-2 px-4 bg-green-700 rounded-md text-white"
              >
                Save
              </button>
            </div>
            <div className="flex gap-2 font-bold text-15px border-gary 200">
              <span
                style={{ backgroundColor: "oklch(0.627 0.194 149.214)" }}
                className="bg-green-700 px-4 py-4 rounded-md text-white"
              >
                CountQuestion:{" "}
                <span className="text-2xl">{quizQuestions.length}</span>
              </span>
            </div>
          </div>

          <div
            style={{ height: "auto" }}
            className="mt-6 p-3 justify-between border-4 border-green-600 rounded-md max-h-[90vh] overflow-y-auto"
          >
            <div
              style={{ height: "auto" }}
              className="flex gap-2 flex-col w-full"
            >
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
                  ref={
                    quizQuestions.length - 1 == questionIndex
                      ? endOfListRef
                      : null
                  }
                  key={questionIndex}
                  className="border-3 ml-5 p-4 mt-4 border-green-600 border-opacity-50-rounded-md"
                >
                  <SingleQuestion
                    questionIndex={questionIndex}
                    ref={textAreaRefs.current[questionIndex]}
                    value={singleQuestion.mainQuestion}
                    onChange={(e) => {
                      handleInputChange(questionIndex, e.target.value);
                    }}
                  />
                  <ChoiceAnswer
                    questionIndex={questionIndex}
                    singleQuestion={singleQuestion}
                    quizQuestion={quizQuestions}
                    setQuizQuestion={setQuizQuestions}
                    value={singleQuestion.choices}
                    onChangeChoice={(text, choiceIndex, questionIndex) => {
                      updateChoicesArray(text, choiceIndex, questionIndex);
                    }}
                    prefixes={prefixes}
                  />
                  {questionIndex !== 0 && (
                    <HighlightOffRoundedIcon
                      className="top-2 right-3 cursor-pointer"
                      style={{ color: "red", marginTop: "5px" }}
                      onClick={() => {
                        deleteQuestion(singleQuestion);
                      }}
                    />
                  )}
                  <CorrectAnswer
                    singleQuestion={singleQuestion}
                    onChangeCorrectAnswer={(text) => {
                      updateCorrectAnswer(text, questionIndex);
                    }}
                  />
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

export const SingleQuestion = forwardRef(function SingleQuestion(
  { questionIndex, value, onChange },
  ref
) {
  return (
    <div style={{ height: "auto" }} className="w-full">
      <div className="flex items-center-gap-3">
        <div className="flex gap-2 font-bold text-15px border-gary 200">
          <span>Question</span>
          <span>{questionIndex + 1}</span>
        </div>
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder="Your question here..."
          name=""
          id=""
          className="border border-gray-500 rounded-md ml-3 w-full h-10 resize-none text-13px outline-none"
        ></textarea>{" "}
      </div>
    </div>
  );
});

export function ChoiceAnswer({
  questionIndex,
  singleQuestion,
  quizQuestion,
  setQuizQuestion,
  onChangeChoice,
  prefixes,
}) {
  const { choices } = singleQuestion;
  const alphabets = ["A", "B", "C", "D"];
  const positions = ["First", "Second", "Third", "Fourth"];

  function addNewChoice() {
    const quizQuestionNew = [...quizQuestion];
    const lastChoicesPosition = quizQuestionNew[questionIndex].choices.length;

    // for (let i = lastChoicesPosition - 1; i >= 0; i--) {
    //   const eachInput = quizQuestionNew[questionIndex].Choices[i].substring(2);
    //   if (eachInput.trim('').length == 0) {
    //     return toast.error(
    //       `please ensure that all previous choices are filled out!`
    //     );
    //   }
    // }

    if (lastChoicesPosition < 4) {
      const newChoice = `${alphabets[lastChoicesPosition]}.`;
      quizQuestionNew[questionIndex].choices.push(newChoice);
      setQuizQuestion(quizQuestionNew);
    } else {
      toast.error("limit of choices is 4");
    }
  }
  function deleteChoiceFunction(choiceIndex) {
    const quizQuestionNew = [...quizQuestion];
    quizQuestionNew[questionIndex].choices.splice(choiceIndex, 1);
    setQuizQuestion(quizQuestionNew);
  }

  function handleChoiceChangeInput(text, choiceIndex, questionIndex) {
    onChangeChoice(text, choiceIndex, questionIndex);
  }
  return (
    <div style={{ height: "auto" }} className="flex gap-10 items-center mt-3">
      <div className="text-15px font-bold">Choices:</div>
      <div className="border-2 border-gray-500 rounded-md p-4 w-full">
        {choices.map((singleChoice, choiceIndex) => (
          <div key={choiceIndex} className="flex gap-2 items-center mt-3">
            <span>{alphabets[choiceIndex]}:</span>
            <input
              value={singleChoice.substring(prefixes[choiceIndex].length + 2)}
              onChange={(e) => {
                handleChoiceChangeInput(
                  e.target.value,
                  choiceIndex,
                  questionIndex
                );
              }}
              placeholder={`Add your ${positions[choiceIndex]} choice`}
              className="border text-13px border-gray-500 p-2 w-full rounded-md outline-none"
            />
            {choiceIndex >= 2 && (
              <HighlightOffRoundedIcon
                className="top-2 right-3 cursor-pointer"
                style={{ color: "red", marginTop: "5px" }}
                onClick={() => {
                  deleteChoiceFunction(choiceIndex);
                }}
              />
            )}
          </div>
        ))}
        <div className="w-full flex justify-center mt-3">
          <button
            onClick={() => {
              addNewChoice();
            }}
            className="bg-green-700 border-gray-200 rounded-md text-white w-210px text-13px"
            style={{ backgroundColor: "royalblue " }}
          >
            Add a new choice
          </button>
        </div>
      </div>
    </div>
  );
}

export function CorrectAnswer({ onChangeCorrectAnswer, singleQuestion }) {
  const [correctAnswerInput, setcorrectAnswerInput] = useState("");
  function handleOnChangeInput(text) {
    const upperText = text.toUpperCase();
    for (const choice of singleQuestion.choices) {
      const eachChoice = choice.substring(0, 1);

      if (eachChoice == upperText || upperText == "") {
        setcorrectAnswerInput(upperText);
        onChangeCorrectAnswer(upperText);
      }
    }
  }
  return (
    <div style={{ height: "auto" }} className="flex gap-10 items-center mt-3">
      <div className="text-15px font-bold">
        Coorect <br /> answer:
      </div>
      <div className="flex gap-2 items-center w-full mt-3">
        <input
          value={correctAnswerInput}
          maxLength={1}
          onChange={(e) => {
            handleOnChangeInput(e.target.value);
          }}
          placeholder={`enter correct answer`}
          className="border text-13px border-gray-500 p-2 w-full rounded-md outline-none"
        />
      </div>
    </div>
  );
}
