import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const RegistrationQuizzModal = ({ quizs, setQuizs }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [names, setNameOfBranch] = useState([{}]);

  const theme = useTheme();
  const [BranchName, setBranchName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof BranchName>) => {
    const {
      target: { value },
    } = event;
    setBranchName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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

  const [listBranch, setListBranch] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    authorId: user?.id,
    branchId: BranchName,
    startDate: "",
    endDate: "",
    typeOfTime: "global Time",
    // navigateQuestion: "no",
  });
  // console.log(data.typeOfTime, data.navigateQuestion);

  function handleSubmit(e) {
    e.preventDefault();
    const quizData = {
      ...data,
      authorId: user.id,
      branchId: BranchName,
    };

    axios
      .post("http://localhost:3000/api/quiz", quizData)
      .then((res) => {
        setQuizs([...quizs, res.data]);
        toast.success("Quizz added successfully");
        setData({
          name: "",
          description: "",
          authorId: user.id,
          branchId: [],
          startDate: "",
          endDate: "",
          typeOfTime: "global Time",
          // navigateQuestion: "no",
        });
        closeModal();
      })
      .catch((err) => {
        toast.error("une erreur est survenue");
      });
  }

  // Gestion de la touche Échap

  function getListBranch() {
    axios("http://localhost:3000/api/branchs")
      .then((res) => {
        setNameOfBranch(res.data);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("Redirection vers /login car pas d'utilisateur");
    navigate("/login");
    return null;
  }
  return (
    <div className="bg-green h-auto">
      {/* Bouton d'ouverture */}
      <button
        onClick={openModal}
        style={{ background: "green", boxShadow: "3px 5px 5px 1px black" }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-4"
      >
        Add New Quiz
      </button>

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
            <h2 className="text-2xl font-bold text-gray-800">Create Quiz</h2>
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
                  Name
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
                      value={name.name}
                      style={getStyles(name.name, BranchName, theme)}
                    >
                      {name.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left ">
              <div className="m-1 w-2/1">
                <FormLabel id="demo-row-controlled-radio-buttons-group">
                  Manage Time
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-controlled-radio-buttons-group"
                  name="row-controlled-radio-buttons-group"
                  value={data.typeOfTime}
                  onChange={(e) => {
                    setData({ ...data, typeOfTime: e.target.value });
                    // const newValue = e.target.value;
                    // setData((prev) => {
                    //   const newData = { ...prev, typeOfTime: newValue };
                    //   if (newValue === "time for any question") {
                    //     delete newData.navigateQuestion; // Suppression cohérente
                    //   } else {
                    //     newData.navigateQuestion = prev.navigateQuestion || "no"; // Réinitialisation propre
                    //   }
                    //   return newData;
                    // });
                  }}
                >
                  {console.log(data)}
                  <FormControlLabel
                    value="global Time"
                    control={<Radio />}
                    label="Global Time"
                  />
                  <FormControlLabel
                    value="time for any question"
                    control={<Radio />}
                    label="Time for any question"
                  />
                </RadioGroup>
              </div>
            </div>
            {/* {data.typeOfTime == "global Time" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="m-1 w-2/1 text-left ">
                  <FormLabel id="demo-row-controlled-radio-buttons-group">
                    Navigate between questions?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-controlled-radio-buttons-group"
                    name="row-controlled-radio-buttons-group"
                    value={data.navigateQuestion}
                    onChange={(e) =>
                      setData({ ...data, navigateQuestion: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
              </div>
            )} */}

            <button
              onClick={(e) => handleSubmit(e)}
              style={{ backgroundColor: "green" }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Create Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationQuizzModal;
