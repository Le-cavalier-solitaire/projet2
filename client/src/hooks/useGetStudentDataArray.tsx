import axios from "axios";
import "../App.css";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";
import { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  surname: string;
  role: "Student";
  brancnId: string;
  dob: string;
  mail: string;
  telephone: string;
  sexe: string;
  adresse: string;
}

export const useGetStudentDataArray = () => {
  const [studentDataArrat, setStudentDataAray] = useState<Student[]>([]);

  function getStudentDAta() {
    axios(`${BASE_URL}/api/userStudents`)
      .then((res) => {
        setStudentDataAray(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get user");
      });
  }

  useEffect(() => {
    getStudentDAta();
  }, []);

  return { studentDataArrat, setStudentDataAray };
};
