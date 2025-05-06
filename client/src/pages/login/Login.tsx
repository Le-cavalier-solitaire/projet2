import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/login.css";
import { TextAnimator } from "../../components/TextAnimator";
import SchoolIcon from "@mui/icons-material/School";
import FacebookIcon from '@mui/icons-material/Facebook';
import MailIcon from '@mui/icons-material/Mail';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';

const Login: React.FC = () => {
  const [data, setData] = useState({
    mail: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activePair, setActivePair] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePair((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email: data.mail,
        password: data.password,
      });

      if (response.data.token) {
        login(response.data.token);
        toast.success("Connexion réussie");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="flex h-screen w-screen fixed inset-0 overflow-hidden">
      {/* Drawer (40%) */}
      <div className="w-2/2 flex bgImage flex-col bg-whiteh-full wavy-border">
        <div className="p-6 border-b border-[#586e75]">
          <h2 className="text-2xl font-mono font-bold text-white">
            sign In
          </h2>
        </div>
        <div className="flex-1 p-6">
          <div className="w-full max-w-md mx-auto p-6">
            <div className="bg-white rounded-sm shadow-xl p-8">
              <div className="text-center mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="text-[30px] font-bold mt-4">
                  Connexion à votre compte
                </p>
                <p className="text-gray-600 mt-2">
                  Entrez vos identifiants pour continuer
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="exemple@email.com"
                      onChange={(e) =>
                        setData({ ...data, mail: e.target.value })
                      }
                      value={data.mail}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                      value={data.password}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Se souvenir de moi
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-500 hover:text-blue-700"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                <button
                  style={{ backgroundColor: "red" }}
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Se connecter
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Pas de compte ?
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form (60%) with background */}
      <div className="w-1/2 bgImage bg-cover bg-center flex items-center justify-center h-full  relative">
        <div className="text-white text-[48px] mb-100">
          <p className="font-bold font-mono">
            {" "}
            <SchoolIcon
              style={{ height: "80px", width: "80px" }}
              className="text-amber-50"
            />cabInfo!_Edu
          </p>
          <p className="text-[22px]">
            <i>
              le garant de l'emploi à l'international via une formation solide!
            </i>
          </p>
        </div>
        <div className="absolute inset-0 bg-opacity-50"></div>
        <TextAnimator />
      </div>
    </div>
  );
};

export default Login;
