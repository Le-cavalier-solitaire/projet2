import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditQuizzModal = ({ quiz, quizs, setQuizs }) => {
  const [listBranch, setListBranch] = useState([]);
  const [listAuthor, setListAuthor] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    name: quiz.name,
    description: quiz.description,
    startDate: quiz.startDate,
    endDate: quiz.endDate,
    authorId: "",
    branchId: "",
    createAt: quiz.createAt,
  });

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .patch(`http://localhost:3000/quiz/${quiz.id}`, { ...data })
      .then((res) => {
        const editQuiz = quizs.map((client) =>
          client.id === quiz.id ? (client = res.data) : client
        );
        setQuizs(editQuiz);
        toast.success("Information modifié avec succès!");
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        toast.error("une erreur est survenue");
      });
  }

  // Gestion de la touche Échap

  function getListBranch() {
    axios("http://localhost:3000/branch?_sort=name&_order=desc")
      .then((res) => {
        setListBranch(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get databranch");
      });
  }

  function getListAuthor() {
    axios("http://localhost:3000/users?role=Teacher")
      .then((res) => {
        setListAuthor(res.data);
      })
      .catch((error) => {
        toast.error("Unable to get dataauthor");
      });
  }

  useEffect(getListAuthor, []);

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
        style={{
          backgroundColor: "oklch(0.623 0.214 259.815)",
          borderRadius: "5px",
          boxShadow: "0px 6px 6px black",
        }}
        onClick={openModal}
        className="text-white"
      >
        Edit
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
                  Description
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  value={data.description}
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
                  Start_Date
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Birthday"
                  onChange={(e) =>
                    setData({ ...data, startDate: e.target.value })
                  }
                  value={data.startDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End_Date
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="phone Number"
                  onChange={(e) =>
                    setData({ ...data, endDate: e.target.value })
                  }
                  value={data.endDate}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Create_At
              </label>
              <input
                type="datetime-local"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="exemple@email.com"
                onChange={(e) => setData({ ...data, createAt: e.target.value })}
                value={data.createAt}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setData({ ...data, authorId: e.target.value })
                  }
                >
                  <option value="">Sélectionner une branche</option>
                  {listAuthor.map((Author) => {
                    return (
                      <option value={Author.id} key={Author.id}>
                        {Author.name} {Author.surname}
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
                    setData({ ...data, branchId: e.target.value })
                  }
                >
                  <option value="">Sélectionner une branche</option>
                  {listBranch.map((branch) => {
                    return (
                      <option value={branch.id} key={branch.id}>
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
              Edit Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuizzModal;
