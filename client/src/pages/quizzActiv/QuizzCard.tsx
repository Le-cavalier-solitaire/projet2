import { useEffect, useState } from "react";
import quizImage from "../../assets/quizImage2.png";
import info from "../../assets/info.png";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import AdsClickRoundedIcon from "@mui/icons-material/AdsClickRounded";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import ResumeQuiz from "./ResumeQuiz";

// Définir les types pour notre application
interface QuizQuestion {
  // Ajouter les propriétés pertinentes ici selon votre modèle de données
  marks: number;
}

interface Result {
  percent?: number;
}

function QuizzCard({ singleQuiz }) {
  const { user, isLoading } = useAuth();
  const [ResultsScore, setResultsScore] = useState<Result[]>([]);
  const [successRate, setSuccessRate] = useState(0);

  const [doQuizStatus, setDoQuizStatus] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [saveQuiz, setSaveQuiz] = useState({});

  const [dateTime, setDateTime] = useState(new Date());
  const [isStarted, setIsStarted] = useState(false);
  const [isActiv, setIsActiv] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [min, setMin] = useState(0);
  const [day, setDay] = useState(0);
  const [hours, setHours] = useState(0);

  // Mise à jour de l'heure actuelle chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Nettoyage
  }, []);

  // Vérifier si le quiz a commencé en fonction de la date
  useEffect(() => {
    if (singleQuiz && singleQuiz.startDate) {
      try {
        // Convertir la date de début en objet Date
        const startDate = new Date(singleQuiz.startDate);

        // Si la date actuelle est APRÈS la date de début, le quiz a commencé
        setIsStarted(dateTime >= startDate);

        //conversion en milliseconde
        const datetimeConvert = dateTime.getTime();
        const startDateConvert = startDate.getTime();
        const ecartMilliscnd = startDateConvert - datetimeConvert;

        // conversion en jr/heure/min
        const day = Math.floor(ecartMilliscnd / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (ecartMilliscnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const min = Math.floor(
          (ecartMilliscnd % (1000 * 60 * 60)) / (1000 * 60)
        );

        //modifiation des valeurs des variables
        setMin(min);
        setDay(day);
        setHours(hours);
      } catch (error) {
        console.error("Erreur lors de la conversion de la date:", error);
        // Par défaut, considérer que le quiz a commencé en cas d'erreur
        setIsStarted(true);
      }
    }
  }, [singleQuiz, dateTime]);

  // verifier si le quiz est en cours
  useEffect(() => {
    if (singleQuiz && singleQuiz.endDate && isStarted && !isEnded) {
      try {
        // Convertir la date de début en objet Date
        const endDate = new Date(singleQuiz.endDate);

        // Si condition vraie
        setIsActiv(true);

        //conversion en milliseconde
        const datetimeConvert = dateTime.getTime();
        const endDateConvert = endDate.getTime();
        const ecartMilliscnd = endDateConvert - datetimeConvert;

        // conversion en jr/heure/min
        const day = Math.floor(ecartMilliscnd / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (ecartMilliscnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const min = Math.floor(
          (ecartMilliscnd % (1000 * 60 * 60)) / (1000 * 60)
        );

        //modifiation des valeurs des variables
        setMin(min);
        setDay(day);
        setHours(hours);
      } catch (error) {
        console.error("Erreur lors de la conversion de la date:", error);
      }
    }
  }, [singleQuiz, dateTime]);

  // verifier si le quiz est achevé
  useEffect(() => {
    if (singleQuiz && singleQuiz.endDate) {
      try {
        // Convertir la date de début en objet Date
        const endDate = new Date(singleQuiz.endDate);

        setIsEnded(dateTime >= endDate);
      } catch (error) {
        console.error("Erreur lors de la conversion de la date:", error);
        setIsEnded(false);
      }
    }
  }, [singleQuiz, dateTime]);

  // Récupérer les résultats et le statut du quiz avec meilleure gestion des erreurs
  useEffect(() => {
    const fetchResults = async () => {
      if (!singleQuiz?.id || !user?.id) return;

      try {
        // Vérifier si l'utilisateur a fait ce quiz
        const userResult = await axios
          .get(`http://localhost:3000/api/results/${user.id}/${singleQuiz.id}`)
          .then((res) => {
            setSaveQuiz(res.data);
            if (res.data.status == "pending") {
              setIsPending(true);
            } else {
              setDoQuizStatus(true);
            }
            return res.data;
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setDoQuizStatus(false);
            } else {
              console.error(
                "Erreur lors de la vérification du statut du quiz:",
                error
              );
            }
            return null;
          });

        // Récupérer tous les résultats du quiz (même si l'utilisateur ne l'a pas fait)
        const allResults = await axios
          .get(`http://localhost:3000/api/results/quizId/${singleQuiz.id}`)
          .then((res) => {
            if (res.data && Array.isArray(res.data)) {
              return res.data;
            }
            return [];
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              return []; // Retourner un tableau vide si aucun résultat
            }
            throw error; // Propager les autres erreurs
          });

        setResultsScore(allResults);
      } catch (error) {
        console.error("Erreur lors de la récupération des résultats:", error);
        setResultsScore([]);
      }
    };

    fetchResults();
  }, [user?.id, singleQuiz?.id]);

  // Calculer le taux de succès moyen à partir des résultats
  useEffect(() => {
    if (ResultsScore.length > 0) {
      // Calculer la somme des pourcentages
      let totalPercent = 0;
      ResultsScore.forEach((result) => {
        totalPercent += result.percent || 0;
      });

      // Calculer la moyenne
      const averagePercent = totalPercent / ResultsScore.length;
      setSuccessRate(Math.round(averagePercent));
    }
  }, [ResultsScore]);

  const { name, quizQuestions } = singleQuiz;
  const totalQuestion = quizQuestions?.length;

  // Utiliser le taux de succès calculé à partir des résultats
  const globalSuccessRate = successRate || 0;

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
    <div
      style={{ height: "auto" }}
      className={`rounded-md flex flex-col gap-2 border-3 border-gray-400 bg-gradient-to-br from-green-700 to-green-900 text-white p-6 relative shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {/* Info icon positioned at top right */}
      <div className="absolute top-3 right-0 cursor-pointer hover:opacity-80 transition-opacity z-10">
        <img
          src={info}
          height={25}
          width={25}
          alt="Information"
          className="opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300"
        />
      </div>

      <div className="relative bg-white bg-opacity-90 w-full h-32 flex justify-center rounded-md shadow-inner">
        <img
          src={quizImage}
          style={{ width: "160px", height: "140px" }}
          className="text-white h-80 w-80 mt-[-5px] hover:scale-105 transition-transform duration-300"
          alt="Quiz"
        />
      </div>
      <h3 className="font-bold text-[20px] font-mono">{name}</h3>
      <p className="font-semibold text-[18px] font-mono">
        {totalQuestion} question(s)
      </p>
      <div className="flex gap-3 mb-2 items-center justify-between">
        <div className="flex gap-1 items-center">
          <AdsClickRoundedIcon className="rounded-full text-white w-9 h-9 flex items-center justify-center" />
          <span className="font-semibold text-[16px] font-mono">
            Success rate:{" "}
            <span className="text-yellow-300">{globalSuccessRate}%</span>
          </span>
        </div>
        <div
          className={`play-button-container rounded-full text-white w-10 h-10 ${
            doQuizStatus
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-green-600 cursor-pointer hover:bg-green-500 hover:scale-110"
          } transition-all duration-300 shadow-md`}
        >
          {" "}
          {doQuizStatus ? (
            <PlayCircleOutlineRoundedIcon
              className="text-gray-400"
              style={{
                height: "40px",
                width: "40px",
              }}
            />
          ) : (
            <Link to={"/quizStart/" + singleQuiz.id + "/" + isPending} className="text-white">
              <PlayCircleOutlineRoundedIcon
                className="text-red-500 animate-pulse"
                style={{
                  height: "40px",
                  width: "40px",
                  animation: "pulse 1.5s infinite ease-in-out",
                }}
              />
            </Link>
          )}
        </div>
      </div>
      <div className="relative bg-opacity-25 w-full flex justify-center rounded-md py-1">
        {isActiv && (
          <div className="absolute top-[-10px] text-[20px] font-extrabold justify-center cursor-pointer hover:opacity-80 transition-opacity z-10 animate-color-change">
            restant {`${day}J ${hours}H ${min}Min`}
          </div>
        )}
      </div>

      {doQuizStatus && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          className="absolute inset-0 bg-opacity-20 flex items-center justify-center rounded-md"
        >
          <div className="bg-pink-600 text-[16px] text-white px-3 py-3 rounded-sm text-sm font-bold">
            Déjà complété
          </div>
        </div>
      )}

      {!isStarted && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          className="absolute inset-0 bg-opacity-20 flex items-center justify-center rounded-md"
        >
          <div className="bg-amber-600 text-white px-3 py-3 rounded-sm text-sm font-bold">
            <p className="text-[16px]">{`Debut dans ${day}J ${hours}H ${min} Min`}</p>
          </div>
          {/* <p>{singleQuiz.startDate}</p> */}
        </div>
      )}

      {isEnded && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          className="absolute inset-0 bg-opacity-20 flex items-center justify-center rounded-md"
        >
          <div className="bg-red-600 text-[16px] text-white px-3 py-3 rounded-sm text-sm font-bold">
            Ce Quiz n'est plus disponible!
          </div>
          {/* <p>{singleQuiz.startDate}</p> */}
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes pulse {
            0% { transform: scale(1); }
            25% { transform: scale(1.2); }
            50% { transform: scale(1); }
            75% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          
          @keyframes colorChange {
            0% { color: #ef4444; } /* red-500 */
            25% { color: #f97316; } /* orange-500 */
            50% { color: #eab308; } /* yellow-500 */
            75% { color: #8b5cf6; } /* violet-500 */
            100% { color: #ef4444; } /* red-500 */
          }
          
          .animate-color-change {
            animation: colorChange 3s infinite;
          }
        `,
        }}
      />
    </div>
  );
}

export default QuizzCard;
