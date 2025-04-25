import { forwardRef } from "react";

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
          className="border border-gray-200 rounded-md ml-3 w-full h-10 resize-none text-13px outline-none"
        ></textarea>{" "}
      </div>
    </div>
  );
});
