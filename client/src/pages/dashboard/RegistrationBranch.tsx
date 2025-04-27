import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Branch } from "../../Interfaces/branch";

interface RegistrationBranchProps {
  branches: Branch[];
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
}

const RegistrationBranch = ({ branches, setBranches }: RegistrationBranchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Vérifier si la branche existe déjà
      const existingBranch = branches.find(branch => branch.name.toLowerCase() === data.name.toLowerCase());
      if (existingBranch) {
        toast.error("Cette branche existe déjà");
        return;
      }

      const response = await axios.post("http://localhost:3000/branch", { ...data });
      setBranches([...branches, response.data]);
      toast.success("Branche créée avec succès!");
      setData({ name: "" });
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de la branche");
    }
  };

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
    <div>
      <button
        onClick={openModal}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
      >
        Nouvelle branche
      </button>

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Créer une branche</h2>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la branche
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                value={data.name}
                placeholder="Entrez le nom de la branche"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
              Ajouter la branche
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationBranch;
