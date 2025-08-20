import { useSelector } from "react-redux";
import { RootState } from "../store";

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);

  // Vérifie aussi si le token est présent dans localStorage
  // pour éviter les incohérences après rafraîchissement
  const localStorageToken = localStorage.getItem("token");

  return {
    ...auth,
    isAuthenticated: auth.isAuthenticated && !!localStorageToken,
  };
};
