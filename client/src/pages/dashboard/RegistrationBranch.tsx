import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const RegistrationModal = () => {
  const [listBranch, setListBranch] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [data, setData] = useState({
    name: "",
  });
  function handleSubmit(e) {
    e.preventDefault();
    axios.get(`http://localhost:3000/branch?mail=${data.name}`).then((res) => {
      if (res.data.length > 0) {
        console.log(res.data);
        toast.error("Branch exist");
      } else {
        axios
          .post("http://localhost:3000/branch", { ...data })
          .then((res) => {
            console.log({ res });
            toast.success("branche créée avec succès!");
          })
          .catch((err) => {
            console.log(err);
            toast.error("une erreur est survenue");
          });
      }
    });
  }

  // Gestion de la touche Échap

  function getListBranch() {
    axios("http://localhost:3000/branch?_sort=name&_order=desc")
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
      <button
        onClick={openModal}
        style={{ background: "green" }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-4"
      >
        New branch
      </button>

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-transparent-pink-500 bg-opacity-50 flex items-center justify-center ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
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
                  Nom de la branche
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
            <button
              onClick={(e) => handleSubmit(e)}
              style={{ backgroundColor: "green" }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add branch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
