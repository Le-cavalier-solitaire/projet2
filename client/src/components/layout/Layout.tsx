import { Outlet, useNavigate } from "react-router-dom";
import "../../assets/sidebar.css";
import { Layout, theme } from "antd";
import { Sidebar } from "./Sidebar";
import { Headers } from "./Headers";
import { Footers } from "./Footers";
import { SettingsDrawer } from "../user/SettingsDrawer";

const { Content } = Layout;

export const Layouts: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  // Déconnexion simple
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "row" }}
    >
      <Sidebar />
      <Layout
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Headers />

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
            backgroundColor: "#dce2e8",
          }}
        >
          <Outlet />
        </Content>
        <Footers />
      </Layout>
      <SettingsDrawer />
    </Layout>
  );
};
