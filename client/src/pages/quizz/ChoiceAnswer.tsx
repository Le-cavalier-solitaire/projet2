import toast from "react-hot-toast";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

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
        <div className="border border-gray-200 rounded-md p-4 w-full">
          {choices.map((singleChoice, choiceIndex) => (
            <div key={choiceIndex} className="flex gap-2 items-center mt-3">
              <span>{alphabets[choiceIndex]}</span>
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
                className="border text-13px border-gray-200 p-2 w-full rounded-md outline-none"
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
              className="bg-green-700 border-gray-300 rounded-md text-white w-210px text-13px"
              style={{ backgroundColor: "royalblue " }}
            >
              Add a new choice
            </button>
          </div>
        </div>
      </div>
    );
  }
  