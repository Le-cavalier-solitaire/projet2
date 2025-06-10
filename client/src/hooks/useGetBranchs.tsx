import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

export const useGetBranchs = () => {
  const [branchs, setBranch] = useState([]);

  function getBranch() {
    axios(`${BASE_URL}/api/branchs`)
      .then((res) => {
        setBranch(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get branch");
      });
  }

  useEffect(() => {
    getBranch();
  }, []);

  return { branchs,setBranch };
};
