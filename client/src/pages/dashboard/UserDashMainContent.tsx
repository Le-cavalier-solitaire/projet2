import React from "react";
import Header from "./Header";
import TableUser from "./TableUser";

const UserDashMainContent = () => (
  <main className="flex-1 md:ml-64">
    <Header />
    <TableUser />
  </main>
);

export default UserDashMainContent;
