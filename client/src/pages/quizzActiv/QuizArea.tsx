import QuizzCard from "./QuizzCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

function QuizArea() {
  const [quizs, setQuizs] = useState([]);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    axios(`http://localhost:3000/api/quiz/${user?.brancnId}`)
      .then((res) => {
        setQuizs(res.data);
      })
      .catch((error) => {
        alert("Unable to get quiz");
      });
  }, [user?.brancnId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {quizs.length == 0 ? (
        <h1 className="text-xl font-bold">My QUizzes</h1>
      ) : (
        <div className="flex w-[] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <div className="mt-10 flex gap-2 flex-wrap">
            {quizs.map((singleQuiz, quizIndex) => (
              <div key={quizIndex}>
                <QuizzCard singleQuiz={singleQuiz} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizArea;
