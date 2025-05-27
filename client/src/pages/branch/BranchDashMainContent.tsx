import Header from "../dashboard/Header";
import TableBranch from "./TableBranch";

const BranchDashMainContent = () => (
  <main className="flex-1 md:ml-64">
    <Header />
    <TableBranch />
  </main>
);

export default BranchDashMainContent;
