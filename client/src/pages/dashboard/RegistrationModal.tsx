import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const RegistrationModal = ({ users, setUsers }) => {
  const [listBranch, setListBranch] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const roles = ["Student", "Administrateur", "Teacher", "Parent"];

  const [data, setData] = useState({
    name: "",
    surname: "",
    mail: "",
    password: "",
    confirm_password: "",
    telephone: "",
    role: "",
    brancnId: "",
    dob: "",
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (data.password !== data.confirm_password) {
      toast.error("les mots de passes ne correspondent pas");
    } else {
      axios
        .get(`http://localhost:3000/api/user/mail/${data.mail}`)
        .then((res) => {
          if (res.data && res.data.mail === data.mail) {
            toast.error("compte existant dejà");
          } else {
            axios
              .post("http://localhost:3000/api/user", { ...data })
              .then((res) => {
                setUsers([...users, res.data]);
                toast.success("Compte créer avec succès!");
                setData({
                  name: "",
                  surname: "",
                  mail: "",
                  password: "",
                  confirm_password: "",
                  telephone: "",
                  role: "",
                  brancnId: "",
                  dob: "",
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
  }

  // Gestion de la touche Échap

  function getListBranch() {
    axios("http://localhost:3000/api/branchs")
      .then((res) => {
        setListBranch(res.data);
      })
      .catch((err) => {
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
        style={{ background: "green", boxShadow: "3px 5px 5px 1px black" }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-4"
      >
        Add User
      </button>

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>

                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  value={data.password}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmation
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setData({ ...data, confirm_password: e.target.value })
                  }
                  value={data.confirm_password}
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
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
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
