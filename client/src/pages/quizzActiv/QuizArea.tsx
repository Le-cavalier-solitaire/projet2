import QuizzCard from "./QuizzCard";
import { useEffect, useState } from "react";
import axios from "axios";

interface Quiz {
  id: string;
  title: string;
  // ajoutez d'autres propriétés selon votre modèle de données
}

function QuizArea() {
  const [quizs, setQuizs] = useState<Quiz[]>([]);

  function getQuiz() {
    axios("http://localhost:3000/api/quiz")
      .then((res) => {
        setQuizs(res.data);
      })
      .catch(() => {
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
          <div className="mt-10 flex gap-2 flex-wrap">
            {quizs.map((singleQuiz) => (
              <div key={singleQuiz.id}>
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
