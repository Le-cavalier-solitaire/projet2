import { Children, createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function ContextPovider({ chidren }) {
  const [allQuizzes, SetAllQuizzes] = useState(["my quiz"]);
  return (
    <GlobalContext.Provider value={{ allQuizzes, SetAllQuizzes }} >
      {Children}
    </GlobalContext.Provider>
  );
}
export default function useGLobalContextProvider() {
  return useContext(GlobalContext);
}
