import Header from "../dashboard/Header";
import TableQuizz from "./TableQuizz";

const QuizzDashMainContent = () => (
  <main className="flex-1 md:ml-64">
    <Header />
    <TableQuizz/>
  </main>
);

export default QuizzDashMainContent;
