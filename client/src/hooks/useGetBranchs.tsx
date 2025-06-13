import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

interface Branch {
  name: string;
  id: string;
}

export const useGetBranchs = () => {
  const [branchs, setBranch] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function getBranch() {
    setIsLoading(true);
    axios(`${BASE_URL}/api/branchs`)
      .then((res) => {
        setBranch(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get branch");
      })
      .finally(() => {
        setIsLoading(false); // <-- Ajouté
      });
  }

  useEffect(() => {
    getBranch();
  }, []);

  return { branchs, setBranch, isLoading };
};
