import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ShutterSpeedRoundedIcon from "@mui/icons-material/ShutterSpeedRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import { useNavigate, useParams } from "react-router-dom";
import correctanswerImg from "../../assets/correct-answer.png";
import incorrectanswerImg from "../../assets/incorrect-answer.png";
import confusedEmoji from "../../assets/confusedEmoji.png";
import happyEmoji from "../../assets/happyEmoji.png";
import verryHappyEmoji from "../../assets/verryHappyEmoji.png";

function DoQuizz() {
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const name = currentQuiz[0]?.name;
  const [quizQuestions, setQuizQuestions ]= useState(currentQuiz[0]?.quizQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [indexOfQuizzSelected, setIndexOfQuizzSelected] = useState(params.id);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [pointQuiz, setpointQuiz] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [incorrectAnswer, setIncorrectAnswer] = useState(0);
  const [timer, setTimer] = useState(60); // Valeur par défaut
  const [parentTimer, setParentTimer] = useState(60); // Valeur par défaut
  const intervalRef = useRef<number | null>(null);
  const quizId = params.id;
  // Mettre à jour les timers lorsque quizQuestions est disponible
  useEffect(() => {
    if (quizQuestions && quizQuestions.length > 0) {
      setTimer(quizQuestions[currentQuestionIndex].time);
      setParentTimer(quizQuestions[currentQuestionIndex].time);
    }
  }, [quizQuestions, currentQuestionIndex]);

  // calculer le total des points
  useEffect(() => {
    if (quizQuestions && quizQuestions.length > 0) {
      const totalPoints = quizQuestions.reduce(
        (total, question) => total + question.marks,
        0
      );
      setpointQuiz(totalPoints);
    }
  }, [quizQuestions]);

  useEffect(() => {
    if (timer == 0 && !isQuizEnded) {
      if (
        selectedChoice == quizQuestions?.[currentQuestionIndex]?.correctAnswer
      ) {
        setTotalAttempts(
          totalAttempts + quizQuestions[currentQuestionIndex].marks
        );
        setCorrectAnswer(correctAnswer + 1);
      } else {
        setIncorrectAnswer(incorrectAnswer + 1);
      }
      setSelectedChoice(null);

      // Si c'est la dernière question, terminer le quiz
      if (currentQuestionIndex >= quizQuestions?.length - 1) {
        setIsQuizEnded(true);
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
      } else {
        // Sinon, passer à la question suivante
        setTimeout(() => {
          setCurrentQuestionIndex((current) => current + 1);
        }, 1000);
      }
    }
  }, [timer]);

  // function onUpdateTime(){
  //   setTime(1000)
  // }
  function onUpdateTime(currentTime: number) {
    setParentTimer(currentTime);
  }

  useEffect(() => {
    // Ne pas démarrer le timer si le quiz est terminé
    if (isQuizEnded) return;

    // Nettoyer l'ancien intervalle s'il existe
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // Créer un nouvel intervalle
    const interval = setInterval(() => {
      setTimer((currentTime: number) => {
        onUpdateTime(currentTime);
        if (currentTime == 0) {
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);

    // Stocker la référence de l'intervalle
    intervalRef.current = interval;

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentQuestionIndex, isQuizEnded]); // Réinitialiser le timer quand on change de question ou que le quiz se termine

  function moveToNextQuestion() {
    if (selectedChoice == quizQuestions[currentQuestionIndex].correctAnswer) {
      setTotalAttempts(
        totalAttempts + quizQuestions[currentQuestionIndex].marks
      );
      setCorrectAnswer(correctAnswer + 1);
    } else {
      setIncorrectAnswer(incorrectAnswer + 1);
    }

    if (currentQuestionIndex == quizQuestions?.length - 1) {
      setTimer(0);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      setIsQuizEnded(true);
      return;
    }
    setQuizQuestions([...currentQuiz.quizQuestions[currentQuestionIndex], selectedChoice])
    setCurrentQuestionIndex((current) => current + 1);
    setSelectedChoice(null);
  }
  console.log({ pointQuiz, totalAttempts, correctAnswer, incorrectAnswer, currentQuiz});

  function getCurrentQuiz() {
    axios
      .get(`http://localhost:3000/quiz?id=${params.id}`)
      .then((res) => {
        setCurrentQuiz(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get user");
      });
  }

  useEffect(getCurrentQuiz, []);

  // useEffect(() => {
  //   if (isQuizEnded) {
  //     quizQuestions.forEach((quizQuestion) => {
  //       quizQuestion.answeredResult = -1;
  //     });
  //     console.log("quiz is end");
  //   }
  // }, [isQuizEnded]);

  useEffect(() => {
    if (params == null) {
      navigate("/MyQuizz");
    }
  }, []);

  function selectedChoiceFunction(choieIndexClicked: number) {
    setSelectedChoice(choieIndexClicked);
  }

  return (
    <div>
      <div className="poopins flex border-3 rounded-sm border-green-100 flex-col px-24 mt-[35px]">
        <div className="justify-between flex mt-3">
          <div className="flex text-white justify-center bg-green-600 w-12 h-12 p-2 rounded-md">
            <CodeRoundedIcon style={{ width: "45px", height: "35px" }} />
          </div>
          <div className="flex flex-col gap-1 mr-45">
            <h2 className="font-extrabold font-mono mt-[-10px] text-[35px]">
              {name}
            </h2>
            <span className="font-lignt font-extrabold mr-45 text-[20px]">
              {quizQuestions?.length} Questions
            </span>
          </div>
          <div className="flex gap-2 text-bold text-[18px] items-center">
            <ShutterSpeedRoundedIcon className="text-green-700" />
            <span>00:00:{parentTimer}</span>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center">
          {quizQuestions && quizQuestions.length > 0 ? (
            <form className="space-y-4 justify-center items-center">
              <div className="flex justify-center items-center gap-2">
                <div className="bg-green-500 text-white font-bold text-[20px] flex justify-center items-center rounded-md w-11 h-11">
                  {currentQuestionIndex + 1}
                </div>
                <p className="text-[24px] font-semibold font-mono">
                  {quizQuestions[currentQuestionIndex].mainQuestion}
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-2">
                {quizQuestions[currentQuestionIndex].choices.map(
                  (choice, indexChoice) => (
                    <div
                      key={indexChoice}
                      onClick={() => {
                        selectedChoiceFunction(indexChoice);
                      }}
                      className={`p-3 ml-11 w-10/12 border border-green-700 rounded-md text-[18px] font-serif transition-all select-none ${
                        selectedChoice === indexChoice
                          ? "bg-white text-black"
                          : "bg-green-700 text-white hover:bg-white hover:text-black"
                      }`}
                    >
                      {choice}
                    </div>
                  )
                )}
              </div>
              <div className="flex justify-center mt-7">
                {selectedChoice !== null && (
                  <button
                    disabled={isQuizEnded ? true : false}
                    style={{
                      backgroundColor: "green",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                    className={`w-1/4 mb-3 bg-blue-500 text-[16px] font-bold text-white py-2 px-2 rounded-sm hover:bg-blue-600 transition duration-200 ${
                      isQuizEnded ? "opacity-60 hidden" : "opacity-100"
                    }`}
                    onClick={(e) => {
                      e.preventDefault(); // Empêche la soumission du formulaire
                      moveToNextQuestion();
                    }}
                  >
                    {currentQuestionIndex == quizQuestions?.length - 1
                      ? "Terminer"
                      : "Suivant"}
                  </button>
                )}
              </div>
            </form>
          ) : (
            <p>Chargement des questions...</p>
          )}
        </div>
        {isQuizEnded && (
          <ScorePoppop
            doQuizzProps={{
              pointQuiz,
              totalAttempts,
              correctAnswer,
              incorrectAnswer,
              quizId,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default DoQuizz;

export function ScorePoppop({ doQuizzProps }) {
  const [userData, setUserData] = useState([]);
  function getDataUsers() {
    const datasUser = localStorage.getItem("users");
    if (datasUser) {
      setUserData(JSON.parse(datasUser));
    }
  }

  useEffect(getDataUsers, []);

  const navigate = useNavigate();
  const { quizId, pointQuiz, totalAttempts, correctAnswer, incorrectAnswer } =
    doQuizzProps;
  function emojiIconScore() {
    const emojiFaces = [confusedEmoji, happyEmoji, verryHappyEmoji];
    const result = (totalAttempts / pointQuiz) * 100;
    if (result <= 49) {
      return emojiFaces[0];
    }
    if (result >= 50 && result <= 85) {
      return emojiFaces[1];
    }
    return emojiFaces[2];
  }

  const result = (totalAttempts / pointQuiz) * 100;
  const score = `${totalAttempts}/${pointQuiz}`;
  const userId = userData?.id || "";
  let feedback = "";

  // Déterminer le feedback en fonction du résultat
  if (result <= 49) {
    feedback = "Non Acquis";
  } else if (result >= 50 && result <= 85) {
    feedback = "En cours d'acquisition";
  } else {
    feedback = "Acquis";
  }

  const [dataResultQuiz, setDataResultQuiz] = useState({
    studentId: userId,
    score: score,
    percent: result,
    quizId: quizId,
    feedback: feedback,
  });

  // Mettre à jour dataResultQuiz lorsque les dépendances changent
  useEffect(() => {
    setDataResultQuiz({
      studentId: userId,
      score: score,
      percent: result,
      quizId: quizId,
      feedback: feedback,
    });
  }, [userId, score, quizId, feedback]);

  //envoie des resultas du user en bd
  function handleSubmit() {
    axios
      .post("http://localhost:3000/results", { ...dataResultQuiz })
      .then((res) => {
        toast.success("n'arrêtez pas de vous exercer 😊!");
        setDataResultQuiz({
          studentId: "",
          score: "",
          quizId: "",
          feedback: "",
          percent: 0,
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("une erreur est survenue");
      });
  }

  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
    >
      <div className="flex w-96 max-w-md items-center justify-center rounded-lg px-6 border-3 border-red-400 bg-red-300">
        <div className="flex mt-5 mb-5 gap-4 items-center justify-center flex-col">
          <img src={emojiIconScore()} alt="" width={100} height={100} />
          <div className="flex gap-1 flex-col">
            <span style={{ color: "black" }} className="font-bold text-[24px]">
              Your Score
            </span>
            <div className="text-[22px] text-center">
              {totalAttempts}/{pointQuiz}
            </div>
          </div>
          <div className="w-full flex gap-2 flex-col mt-3">
            <div className="gap-1 flex items-center justify-center">
              <img src={correctanswerImg} alt="" width={60} height={60} />
              <span className="text-[18px]">
                Correct Answer: {correctAnswer}
              </span>
            </div>
            <div className="gap-1 flex items-center justify-center">
              <img src={incorrectanswerImg} alt="" width={40} height={40} />
              <span className="text-[18px]">
                Incorrect Answer: {incorrectAnswer}
              </span>
            </div>
          </div>
          <button
            style={{
              backgroundColor: "oklch(0.808 0.114 19.571)",
              fontWeight: "bold",
              fontSize: "16px",
              borderBottom: "2px solid red",
              borderRadius: "10px",
            }}
            className="mb-2 mt-1 text-[16px] font-bold text-white py-2 px-2 rounded-sm w-full"
            onClick={() => handleSubmit()}
          >
            Aller à ma page
          </button>
        </div>
      </div>
    </div>
  );
}
