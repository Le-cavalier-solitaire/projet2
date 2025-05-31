import Header from "../dashboard/Header";
import TableResult from "./TableResult";

export default function ResultDashMainContent() {
  return (
    <main className="flex-1 md:ml-64 bg-gray-100">
      <Header />
      <TableResult />
    </main>
  );
}
