import React, { useState } from 'react';
import { Branch } from '../Interfaces/branch';

const BranchList: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [newBranchText, setNewBranchText] = useState<string>('');
  const [editBranchId, setEditBranchId] = useState<number | null>(null);
  const [editBranchText, setEditBranchText] = useState<string>('');

  const handleAddBranch = () => {
    if (newBranchText.trim()) {
      const newBranch: Branch = {
        id: Date.now(),
        name: newBranchText,
      };
      setBranches([...branches, newBranch]);
      setNewBranchText('');
    }
  };

  const handleEditBranch = (id: number) => {
    const branch = branches.find((branch) => branch.id === id);
    if (branch) {
      setEditBranchId(id);
      setEditBranchText(branch.name);
    }
  };

  const handleUpdateBranch = () => {
    if (editBranchId !== null && editBranchText.trim()) {
      setBranches(
        branches.map((branch) =>
          branch.id === editBranchId ? { ...branch, text: editBranchText } : branch
        )
      );
      setEditBranchId(null);
      setEditBranchText('');
    }
  };

  const handleDeleteBranch = (id: number) => {
    setBranches(branches.filter((branch) => branch.id !== id));
  };

  return (
    <div>
      <h2>Liste des branches</h2>
      <ul>
        {branches.map((branch) => (
          <li key={branch.id}>
            {editBranchId === branch.id ? (
              <>
                <input
                  type="text"
                  value={editBranchText}
                  onChange={(e) => setEditBranchText(e.target.value)}
                />
                <button onClick={handleUpdateBranch}>Update values</button>
              </>
            ) : (
              <>
                {branch.name}
                <button onClick={() => handleEditBranch(branch.id)}>Modify</button>
                <button onClick={() => handleDeleteBranch(branch.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>AAdd new branch</h3>
      <input
        type="text"
        placeholder="Nouvelle branche"
        value={newBranchText}
        onChange={(e) => setNewBranchText(e.target.value)}
      />
      <button onClick={handleAddBranch}>Ajouter</button>
    </div>
  );
};

export default BranchList;