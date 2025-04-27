import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import { Branch } from "../../Interfaces/branch";
import RegistrationBranch from "./RegistrationBranch";

const BranchList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://localhost:3000/branch?_sort=name&_order=desc");
      setBranches(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des branches:", error);
      toast.error("Erreur lors de la récupération des branches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:3000/branch/${id}`);
      if (response.data.success) {
        toast.success("Branche supprimée avec succès");
        setBranches(branches.filter(branch => branch.id !== id));
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de la branche");
    }
  };

  return (
    <div className="min-h-screen md:flex">
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed right-4 bottom-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Liste des Branches</h1>
          <RegistrationBranch branches={branches} setBranches={setBranches} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune branche disponible</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {branches.map((branch) => (
                  <tr key={branch.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {branch.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(branch.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchList;
