import axios from "axios";
import "../App.css";
import toast from "react-hot-toast";
import RegistrationBranchModal from "./RegistrationBranchModal";
import EditBranchModal from "./EditBranchModal";
import { Tooltip } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import { useGetBranchs } from "../../hooks";
import { BASE_URL } from "../../api";

const TableBranch = () => {

  const {branchs,setBranch}=useGetBranchs()



  const deleteBranch = (id:number) => {
    axios
      .delete(`${BASE_URL}/api/deleteBranch/${id}`)
      .then(() => {
        setBranch(branchs.filter((branch) => branch.id !== id));
        toast.success("branch has already delete");
      })
      .catch((error) => {
        toast.error("Unable to delete branch");
      });
  };

  return (
    <main className="ml-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des branches</h1>
        <RegistrationBranchModal branchs={branchs} setBranch={setBranch} />
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table
          className="w-full justify-center items-center"
          style={{ minWidth: "750px" }}
        >
          <thead className="bg-gray-50">
            <tr>
              {["Nom", "Actions"].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {branchs.map((branch) => {
              return (
                <tr key={branch.id}>
                  <td className="px-6 py-4 font-mono font-semibold text-[20px]">
                    {branch.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-2">
                      <EditBranchModal
                        branch={branch}
                        branchs={branchs}
                        setBranch={setBranch}
                      />
                      <Tooltip title="Delete branch">
                        <button
                          style={{
                            backgroundColor: "oklch(0.505 0.213 27.518)",
                            borderRadius: "5px",
                            boxShadow: "0px 6px 6px black",
                          }}
                          onClick={() => deleteBranch(branch.id)}
                          className="text-white"
                        >
                          <DeleteForever fontSize="medium" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TableBranch;
