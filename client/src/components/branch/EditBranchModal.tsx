import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { EditButton } from "../../components";
import { UseControlModal } from "../../hooks";
import { BASE_URL } from "../../api";

interface Branch {
  name: string;
  id: string;
}

type BranchComponentProps = {
  branch: Branch;
  branchs: Branch[];
  setBranch: (newBranches: Branch[]) => void;
};

const EditBranchModal = ({
  branch,
  branchs,
  setBranch,
}: BranchComponentProps) => {
  const { isOpen, setIsOpen, openModal, handleBackdropClick, closeModal } =
    UseControlModal();
  const [data, setData] = useState({
    name: branch.name,
  });

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    axios
      .patch(`${BASE_URL}/api/updatebranch/${branch.id}`, { ...data })
      .then((res) => {
        const branchUpdate = res.data.branch;
        const editQuiz = branchs.map((client) =>
          client.id === branch.id ? (client = branchUpdate) : client
        );
        setBranch(editQuiz);
        toast.success("Information modifié avec succès!");
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

      <EditButton onClick={openModal} text="Edit branch" />

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        className={`fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="bg-white rounded-lg shadow-xl w-[450px] p-6 mx-4 relative">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-mono text-[28px] font-bold text-gray-800">
              Edit branch
            </h2>
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
            <div className="grid  justify-center items-center grid-cols-1 md:grid-cols-2 gap-4">
              <div className="">
                <label className="flex text-center text-[20px] font-mono font-semibold text-gray-700 mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  required
                  className="w-[400px] px-4 py-2 text-black border-2 font-mono text-[18px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  value={data.name}
                />
              </div>
            </div>

            <button
              onClick={(e) => handleSubmit(e)}
              style={{ backgroundColor: "green" }}
              type="submit"
              className="w-1/3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Edit branch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBranchModal;
