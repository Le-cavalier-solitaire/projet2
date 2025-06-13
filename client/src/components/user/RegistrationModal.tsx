import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  UseControlModal,
  useGetBranchs,
  useGetStudentDataArray,
} from "../../hooks";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import { BASE_URL } from "../../api";

interface User {
  id: number;
  name: string;
  surname: string;
  role: string;
  brancnId?: string;
  dob: string;
  mail: string;
  telephone: string;
  studentArrayId?: string[];
  sexe: string;
  adresse: string;
}
type UserComponentProps = {
  users: User[];
  setUsers: () => void;
};

const RegistrationModal = ({ users, setUsers }) => {
  const { branchs } = useGetBranchs();
  const { studentDataArrat } = useGetStudentDataArray();

  const { isOpen, setIsOpen, openModal, handleBackdropClick, closeModal } =
    UseControlModal();
  const roles = ["Student", "Administrateur", "Teacher", "Parent"];
  const [selectedIdOfStudent, setSelectedIdOfStudent] = useState([]);
  const [selectedIdBranch, setSelectedIdBranch] = useState("");
  const [selectedNameBranch, setSelectedNameBranch] = useState("");

  const [data, setData] = useState({
    name: "",
    surname: "",
    mail: "",
    telephone: "",
    role: "",
    brancnId: selectedIdBranch,
    dob: "",
    studentArrayId: selectedIdOfStudent,
    sexe: "Male",
    adresse: "",
  });
  const [selectedNameOfStudent, setSelectedNameOfStudent] = useState([]);

  useEffect(() => {
    setData((prev) => ({ ...prev, studentArrayId: selectedIdOfStudent }));
  }, [selectedIdOfStudent]);

  useEffect(() => {
    setData((prev) => ({ ...prev, brancnId: selectedIdBranch }));
  }, [selectedIdBranch]);

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get(`${BASE_URL}/api/user/mail/${data.mail}/${data.telephone}`)
      .then((res) => {
        if (res.data && res.data.mail === data.mail) {
          toast.error("compte existant dejà");
        } else if (res.data && res.data.telephone === data.telephone) {
          toast.error("Numéro de telephone dejà enregistré");
        } else {
          axios
            .post(`${BASE_URL}/api/user`, { ...data })
            .then((res) => {
              const newUser = res.data;
              setUsers([...users, res.data]);
              toast.success("Compte créer avec succès!");
              setData({
                name: "",
                surname: "",
                mail: "",
                telephone: "",
                role: "",
                brancnId: "",
                dob: "",
                studentArrayId: [],
                sexe: "Male",
                adresse: "",
              });
              closeModal();
            })
            .catch((err) => {
              console.log(err);
              toast.error("une erreur est survenue");
            });
        }
      });
  }

  return (
    <div className="bg-green h-auto">
      {/* Bouton d'ouverture */}
      <button
        onClick={openModal}
        style={{ background: "green", boxShadow: "3px 5px 5px 1px black" }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-4"
      >
        Add User
      </button>

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
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
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="exemple@email.com"
                  onChange={(e) => setData({ ...data, mail: e.target.value })}
                  value={data.mail}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Yaounde, Nlonkak Rue 106"
                  onChange={(e) =>
                    setData({ ...data, adresse: e.target.value })
                  }
                  value={data.adresse}
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

            <div
              className={` ${data.role == "Student" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  required
                  className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${data.role !== "Student" ? "w-full" : "w-full"}`}
                  onChange={(e) => {
                    // setData({ ...data, role: e.target.value })
                    const newValue = e.target.value;
                    setData((prev) => {
                      const newData = { ...prev, role: newValue };
                      if (newValue === "Student") {
                        delete newData.studentArrayId; // Suppression cohérente
                        newData.brancnId = selectedIdBranch;
                      } else if (newValue === "Parent") {
                        delete newData.brancnId; // Suppression cohérente
                        newData.studentArrayId = selectedIdOfStudent;
                      } else {
                        delete newData.studentArrayId; // Suppression cohérente
                        delete newData.brancnId; // Suppression cohérente
                      }
                      return newData;
                    });
                  }}
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
              {data.role == "Student" && (
                <Autocomplete
                  disablePortal
                  options={branchs}
                  getOptionLabel={(option) => option.name}
                  value={selectedNameBranch}
                  onChange={(event, newBranch) => {
                    setSelectedNameBranch(newBranch);
                    setSelectedIdBranch(newBranch ? newBranch.id : null);
                  }}
                  sx={{ marginTop: 2 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Branch" />
                  )}
                />
              )}
            </div>

            <div className="">
              {data.role == "Parent" && (
                <div>
                  <Autocomplete
                    multiple
                    limitTags={2}
                    id="multiple-limit-tags"
                    options={studentDataArrat}
                    getOptionLabel={(option) =>
                      option.name + " " + option.surname
                    }
                    value={selectedNameOfStudent}
                    onChange={(event, newValue) => {
                      setSelectedNameOfStudent(newValue);
                      setSelectedIdOfStudent(newValue.map((item) => item.id));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Name Of Your Chidren"
                        placeholder="Favorites"
                      />
                    )}
                    sx={{}}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left ">
              <div className="m-1 w-2/1">
                <FormLabel id="demo-row-controlled-radio-buttons-group">
                  Sexe
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-controlled-radio-buttons-group"
                  name="row-controlled-radio-buttons-group"
                  value={data.sexe}
                  onChange={(e) => {
                    setData({ ...data, sexe: e.target.value });
                  }}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </div>
            </div>

            <button
              onClick={(e) => handleSubmit(e)}
              style={{ backgroundColor: "green" }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
