import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import plus from "../../assets/plus.png";
import { UseControlModal } from "../../hooks";
import { BASE_URL } from "../../api";

interface Branch {
  name: string;
  id: string;
}

type BranchComponentProps = {
  branchs: Branch[];
  setBranch: (newBranches: Branch[]) => void;
};

const RegistrationBranchModal = ({
  branchs,
  setBranch,
}: BranchComponentProps) => {
  const { isOpen, setIsOpen, openModal, handleBackdropClick, closeModal } =
    UseControlModal();
  const [data, setData] = useState({
    name: "",
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (!data.name || data.name.trim() === "") {
      toast.error("Le nom de la branche est requis");
      return;
    }
    const branchExisting = branchs.find((branch) => branch.name == data.name);
    console.log(branchExisting);
    if (branchExisting) {
      toast.error("Une branche de ce nom existe déjà");
      return;
    }
    axios
      .post(`${BASE_URL}/api/branch`, { ...data })
      .then((res) => {
        setBranch([...branchs, res.data]);
        toast.success("branch added successfully");
        setData({
          name: "",
        });
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        toast.error("une erreur est survenue");
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
        Add branch
      </button>

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        className={`fixed inset-0 bg-opacity-50 flex items-center justify-center z-50  ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="bg-white rounded-lg shadow-xl w-[450px] p-6 mx-4 relative">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <u>
              {" "}
              <h2 className="font-mono text-[28px] font-bold text-gray-800">
                Create branch
              </h2>
            </u>

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
                <label className="flex text-center text-[20px] font-mono font-semibold text-gray-700 mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  required
                  className="w-[400px] px-3 py-2 ext-black border-2 font-mono text-[18px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setData({ ...data, name: e.target.value.toUpperCase() })
                  }
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
              Create branch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationBranchModal;
