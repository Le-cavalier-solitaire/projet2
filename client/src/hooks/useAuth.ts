import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface User {
  id: string;
  name: string;
  surname: string;
  mail: string;
  role: string;
}

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        fetchUserData(decodedToken.userId);
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      fetchUserData(decodedToken.userId);
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
