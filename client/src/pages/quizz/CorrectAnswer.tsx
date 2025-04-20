import { useState } from "react";

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
      <div className="text-15px font-bold">Coorect answer:</div>
      <div className="flex gap-2 items-center w-full mt-3">
        <input
          value={correctAnswerInput}
          maxLength={1}
          onChange={(e) => {
            handleOnChangeInput(e.target.value);
          }}
          placeholder={`enter correct answer`}
          className="border text-13px border-gray-200 p-2 w-full rounded-md outline-none"
        />
      </div>
    </div>
  );
}
