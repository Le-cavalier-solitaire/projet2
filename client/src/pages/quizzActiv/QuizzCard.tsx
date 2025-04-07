import React from "react";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import AdsClickRoundedIcon from "@mui/icons-material/AdsClickRounded";
import useGLobalContextProvider from "./contextApi"; 
function QuizzCard() {
  return (
    <div className="rounde-10px flex flex-col gap-2 border border-gray-200 bg-white p-4">
      <div className="relative bg-green-700 w-full h-32 flex justify-center rounded-md">
        <div className="absolute cursor-pointer top-3 right-3">
          <p className="text-white h-13 w-13 font-bold ">{""}</p>
        </div>
        <CodeRoundedIcon
          style={{ width: "80px", height: "80px", marginTop: "10" }}
          className="text-white h-80 w-80"
        />
      </div>
      <h3 className="font-bold">React quiz</h3>
      <p className="text-sm font-light">05 Questions</p>
      <div className="flex gap-3">
        <div className="flex gap-1 items-center">
          <AdsClickRoundedIcon className="rounded-full text-white w-9 h-9 bg-green-700 flex items-center justify-center" />
          <span className="text-12px">Success rate: 80%</span>
        </div>
        <div className="rounded-full text-white w-7 h-7 bg-green-700 flex items-center justify-center cursor">
          <PlayCircleOutlineRoundedIcon style={{ height: "25", width: "25" }} />{" "}
        </div>
      </div>
    </div>
  );
}

export default QuizzCard;
