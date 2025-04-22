import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import toast from "react-hot-toast";
import RegistrationBranchModal from "./RegistrationBranchModal";
import EditBranchModal from "./EditBranchModal";
import branchIcon from "../../assets/branchIcon.png";
import trash from "../../assets/trash.png";

const TableBranch = () => {
  const [branchs, setBranch] = useState([]);

  function getBranch() {
    axios("http://localhost:3000/branch?_sort=name&_order=desc")
      .then((res) => {
        setBranch(res.data);
      })
      .catch((error) => {
        alert("Unable to get quiz");
      });
  }

  useEffect(() => {
    getBranch();
  }, []);

  const deleteBranch = (id) => {
    axios
      .delete(`http://localhost:3000/branch/${id}`)
      .then(() => {
        setBranch(branchs.filter((branch) => branch.id !== id));
        toast.success("branch has already delete");
      })
      .catch((error) => {
        alert("Unable to delete User");
      });
  };

  return (
    <main className="ml-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Quizs</h1>
      </div>

      <div className="flex w-[] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="mt-6 flex gap-2 flex-wrap">
          <RegistrationBranchModal branchs={branchs} setBranch={setBranch} />
        </div>
        <div className="mt-10 flex gap-2 flex-wrap">
          {branchs.map((branch) => {
            return (
              <div
                className={`rounded-md flex flex-col w-[220px]  h-[250px] gap-2 border-3 border-gray-400 bg-green-700 text-white p-6 relative`}
              >
                {/* Info icon positioned at top right */}

                <div className="relative w-full h-32 flex justify-center rounded-md">
                  <img
                    src={branchIcon}
                    style={{ width: "140px", height: "100px" }}
                    className="text-white h-80 w-80 mt-[-5px]"
                    alt="Quiz"
                  />
                </div>
                <h3 className="font-bold text-[20px] font-mono">
                  {branch.name}
                  <p className="font-semibold text-[18px] font-mono">
                    Id:{branch.id}
                  </p>
                </h3>
                <div className="flex gap-3 items-center justify-between">
                  <div className="flex gap-1 items-center">
                    <EditBranchModal
                      branch={branch}
                      branchs={branchs}
                      setBranch={setBranch}
                    />{" "}
                  </div>
                  <div
                    className={`rounded-full text-white w-10 h-10 bg-green-600 flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors`}
                  >
                    <button
                      style={{
                        backgroundColor: "red",
                        borderRadius: "100%",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
                        height: "35px",
                        width: "35px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                      onClick={() => deleteBranch(branch.id)}
                      className="text-white hover:scale-110 transition-transform duration-200"
                    >
                      <img
                        src={trash}
                        height={20}
                        width={20}
                        className="object-cover"
                        alt="Éditer"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/*branch table */}
    </main>
  );
};

export default TableBranch;
