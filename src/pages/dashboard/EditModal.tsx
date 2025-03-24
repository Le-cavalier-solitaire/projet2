import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const EditModal = () => {
  const [listBranch, setListBranch] = useState([]);
  const params = useParams();
  console.log(params);
  const [initialData, setInitialData] = useState([]);
  const roles = ["Student", "Administrateur", "Teacher", "Parent"];
  const navigate = useNavigate();

  function getuser() {
    axios
      .get(`http://localhost:3000/users?id=${params.id}`)
      .then((res) => {
        setInitialData(res.data);
      })
      .catch((error) => {
        alert("Unable to get user");
      });
  }

  useEffect(getuser, []);
  console.log(initialData);

  const [data, setData] = useState({
    name: "",
    surname: "",
    mail: "",
    telephone: "",
    role: "",
    brancnId: "",
    dob: "",
  });
  function handleSubmit(e) {
    e.preventDefault();

    axios
      .patch(`http://localhost:3000/users/${params.id}`, { ...data })
      .then((res) => {
        console.log(res);
        toast.success("Modification réussie!");
        navigate("/");
        setData("")
      })
      .catch((err) => {
        console.log(err);
        /*toast.success*/ alert("une erreur est survenue");
      });
  }

  // Gestion de la touche Échap

  function getListBranch() {
    axios("http://localhost:3000/branch?_sort=name&_order=desc")
      .then((res) => {
        setListBranch(res.data);
      })
      .catch((error) => {
        alert("Unable to get data");
      });
  }

  useEffect(getListBranch, []);

  return (
    <div className="bg-green h-auto">
      {/* Bouton d'ouverture */}

      {/* Overlay du modal */}

      {/* Contenu du modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Modification d'information
          </h2>
        </div>
        {initialData.map((datauser) => (
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
                  defaultValue={datauser.surname}
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
                  defaultValue={datauser.name}
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
                  defaultValue={datauser.dob}
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
                  defaultValue={datauser.telephone}
                />
              </div>
            </div>

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
                defaultValue={datauser.mail}
              />
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
                      <option value={branch.id} key={branch.id}>
                        {branch.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="term"
                required
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                J'accepte les
                <a href="#" className="text-blue-600 hover:underline">
                  conditions d'utilisation
                </a>
              </label>
            </div>

            <button
              onClick={(e) => handleSubmit(e)}
              style={{ backgroundColor: "green" }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Update Informations
            </button>
          </form>
        ))}
      </div>
    </div>
  );
};

export default EditModal;
