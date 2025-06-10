import { DeleteForever } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";

interface Props {
onClick:()=> void
}

export  const DeleteButton:React.FC<Props>=({onClick})=> {
  return (
    <Tooltip title="Delete">
      <button
        style={{
          backgroundColor: "oklch(0.505 0.213 27.518)",
          borderRadius: "5px",
          boxShadow: "0px 6px 6px black",
        }}
        onClick={onClick}
        className="text-white"
      >
        <DeleteForever fontSize="medium" />
      </button>
    </Tooltip>
  );
}
