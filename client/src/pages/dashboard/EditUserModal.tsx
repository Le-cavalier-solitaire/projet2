import { Tooltip } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";


const EditUserModal = ({ user, users, setUsers }) => {
  const [listBranch, setListBranch] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const roles = ["Student", "Administrateur", "Teacher", "Parent"];
  console.log(user);

  const [data, setData] = useState({
    name: user.name,
    surname: user.surname,
    telephone: user.telephone,
    role: user.role,
    brancnId: "",
    dob: user.dob,
  });
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Envoi des données pour mise à jour:", data);

    axios
      .patch(`http://localhost:3000/api/updateUser/${user.id}`, { ...data })
      .then((response) => {
        console.log("Réponse de mise à jour:", response.data);

        // Extraire l'utilisateur mis à jour de la réponse
        const updatedUser = response.data.user;

        // Mettre à jour le tableau users en remplaçant l'ancien utilisateur par le nouveau
        const updatedUsers = users.map((client) =>
          client.id === user.id ? updatedUser : client
        );

        console.log("Tableau users mis à jour:", updatedUsers);
        setUsers(updatedUsers);
        toast.success("Information modifiée avec succès!");
        closeModal();
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour:", err);
        toast.error("Une erreur est survenue lors de la mise à jour");
      });
  }

  // Gestion de la touche Échap

  function getListBranch() {
    axios("http://localhost:3000/api/branchs")
      .then((res) => {
        setListBranch(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get data");
      });
  }

  useEffect(getListBranch, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="bg-green h-auto">
      {/* Bouton d'ouverture */}

      <Tooltip title="Edit quiz">
        <button
          style={{
            backgroundColor: "oklch(0.623 0.214 259.815)",
            borderRadius: "5px",
            boxShadow: "0px 6px 6px black",
          }}
          onClick={openModal}
          className="text-white"
        >
          <EditIcon fontSize="medium" />
        </button>
      </Tooltip>

      {/* Overlay du modal */}
      <div
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-opacity-50 flex items-center justify-center ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit</h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setData({ ...data, surname: e.target.value })
                  }
                  value={data.surname}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  value={data.name}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Birthday"
                  onChange={(e) => setData({ ...data, dob: e.target.value })}
                  value={data.dob}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="phone Number"
                  onChange={(e) =>
                    setData({ ...data, telephone: e.target.value })
                  }
                  value={data.telephone}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                >
                  <option value="">Sélectionner une branche</option>
                  {roles.map((role) => {
                    return (
                      <option value={role} key={role}>
                        {role}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branche
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setData({ ...data, brancnId: e.target.value })
                  }
                >
                  <option value="">Sélectionner une branche</option>
                  {listBranch.map((branch) => {
                    return (
                      <option value={branch.name} key={branch.id}>
                        {branch.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <button
              onClick={(e) => handleSubmit(e)}
              style={{ backgroundColor: "green" }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Edit Information
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
