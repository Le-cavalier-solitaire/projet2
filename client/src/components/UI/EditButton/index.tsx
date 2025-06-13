import { DeleteForever } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "antd";

import React from "react";

interface Props {
  onClick: () => void;
  text: string;
}

export const EditButton: React.FC<Props> = ({ onClick, text }) => {
  return (
    <Tooltip title={text}>
      <Button
        style={{ color: "blue" }}
        shape="circle"
        icon={<EditIcon />}
        size="large"
        onClick={onClick}
      />
    </Tooltip>
  );
};
