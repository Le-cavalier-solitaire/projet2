import React from "react";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import AdsClickRoundedIcon from "@mui/icons-material/AdsClickRounded";
import useGLobalContextProvider from "./contextApi";
import { Link } from "react-router-dom";

function successRate(singleQuiz) {
  let correctQuestions = 0;
  let totalAttemptes = 0;
  let successRate = 0;

  singleQuiz.quizQuestions.forEach((question) => {
    totalAttemptes += question.statistics.totalAttempts;
    correctQuestions += question.statistics.correctAttempts;
  });

  successRate = Math.ceil((correctQuestions / totalAttemptes) * 100);
  return successRate;
}

function QuizzCard({ singleQuiz }) {
  const { name, quizQuestions } = singleQuiz;
  const totalQuestion = quizQuestions?.length;
  const globalSuccessRate = successRate(singleQuiz);
  return (
    <div className="rounded-md flex flex-col gap-2 border-3 border-gray-400 bg-white p-6">
      <div className="relative bg-green-700 w-full h-32 flex justify-center rounded-md">
        <div className="absolute cursor-pointer top-3 right-3">
          <p className="text-white h-13 w-13 font-bold ">{""}</p>
        </div>
        <CodeRoundedIcon
          style={{ width: "80px", height: "80px", marginTop: "10" }}
          className="text-white h-80 w-80"
        />
      </div>
      <h3 className="font-bold">{name}</h3>
      <p className="text-md font-light">{totalQuestion} question(s)</p>
      <div className="flex gap-3 mb-2">
        <div className="flex gap-1 items-center">
          <AdsClickRoundedIcon className="rounded-full text-white w-9 h-9 bg-green-500 flex items-center justify-center" />
          <span className="text-12px">Success rate: {globalSuccessRate}%</span>
        </div>
        <div className="rounded-full text-white w-7 h-7 bg-green-700 flex items-center justify-center cursor">
          <Link to={"/quizStart/" + singleQuiz.id} className="">
            <PlayCircleOutlineRoundedIcon
              style={{ height: "25", width: "25", }}
            />
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}

export default QuizzCard;
