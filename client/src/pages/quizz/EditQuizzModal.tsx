import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Quiz {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  branchId: string[];
}

const EditQuizzModal = ({ quiz, quizs, setQuizs }) => {
  const [listBranch, setListBranch] = useState([]);
  const [listAuthor, setListAuthor] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [BranchName, setBranchName] = useState<string[]>([]);
  const [data, setData] = useState({
    name: quiz.name,
    description: quiz.description,
    startDate: quiz.startDate,
    endDate: quiz.endDate,
    branchId: BranchName,
    createAt: quiz.createAt,
  });

  const names = [
    { id: 1, nameBranch: "Maintenance" },
    { id: 2, nameBranch: "Programmation" },
    { id: 3, nameBranch: "Bureautique" },
    { id: 4, nameBranch: "Administratoin et securité reseau" },
  ];
  const theme = useTheme();

  useEffect(() => {
    setData((prev) => ({ ...prev, branchId: BranchName }));
  }, [BranchName]);

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    setBranchName(typeof value === "string" ? value.split(",") : value);
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  function getStyles(name: string, BranchName: string[], theme: Theme) {
    return {
      fontWeight: BranchName.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .patch(`http://localhost:3000/api/updateQuiz/${quiz.id}`, { ...data })
      .then((res) => {
        const editQuiz = res.data.quiz;
        const editQuizs = quizs.map((client) =>
          client.id === quiz.id ? (client = editQuiz) : client
        );
        setQuizs(editQuizs);
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

  if (!quiz) {
    return <div>Chargement du quiz...</div>; // Ou un message d'erreur
  }

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
        onClick={handleBackdropClick}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="m-1 w-2/1">
                <InputLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Name branch
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  aria-placeholder="Select Branch"
                  value={BranchName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                  fullWidth
                  className="w-full text-black"
                >
                  {names.map((name) => (
                    <MenuItem
                      key={name.id}
                      value={name.id}
                      style={getStyles(name.nameBranch, BranchName, theme)}
                    >
                      {name.nameBranch}
                    </MenuItem>
                  ))}
                </Select>
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
