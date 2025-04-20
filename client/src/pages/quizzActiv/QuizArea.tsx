import QuizzCard from "./QuizzCard";
import DoQuizz from "./DoQuizz";
import { useEffect, useState } from "react";
import axios from "axios";

function QuizArea() {
  const [quizs, setQuizs] = useState([]);

  function getQuiz() {
    axios("http://localhost:3000/quiz?_sort=name&_order=desc")
      .then((res) => {
        setQuizs(res.data);
      })
      .catch((error) => {
        alert("Unable to get quiz");
      });
  }

  useEffect(() => {
    getQuiz();
  }, []);

  return (
    <div>
      {quizs.length == 0 ? (
        <h1 className="text-xl font-bold">My QUizzes</h1>
      ) : (
        <div className="flex w-[] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <h1 className="text-xl font-bold">My QUizzes</h1>
          <div className="mt-10 flex gap-2 flex-wrap">
            {quizs.map((singleQuiz, quizIndex) => (
              <div key={quizIndex}>
                <QuizzCard singleQuiz={singleQuiz}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizArea;
