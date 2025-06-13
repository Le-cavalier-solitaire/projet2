import { DeleteForever } from "@mui/icons-material";
import React from "react";
import type { PopconfirmProps } from "antd";
import { Button, message, Popconfirm } from "antd";
import { Tooltip } from "@mui/material";
import type { ConfigProviderProps } from "antd";

interface Props {
  onClick: () => void;
  text: string;
}

export const DeleteButton: React.FC<Props> = ({ onClick, text }) => {
  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <Popconfirm
      title={text}
      description={`Are you sure to ${text} ?`}
      onConfirm={onClick}
      onCancel={cancel}
      okText="Yes"
      cancelText="No"
    >
      <Tooltip title={text}>
        <Button
          danger
          // style={{ backgroundColor: "#fb2c36", color: "white" }}
          shape="circle"
          icon={<DeleteForever />}
          size="large"
        />
      </Tooltip>
    </Popconfirm>
  );
};
