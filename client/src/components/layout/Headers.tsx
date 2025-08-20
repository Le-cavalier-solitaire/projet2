import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slice/Auth/authSlice";
import "../../assets/sidebar.css";
import {
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, theme } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { Dropdown, Space } from "antd";
import { useEffect, useState } from "react";
import type { PopconfirmProps } from "antd";
import { message, Popconfirm } from "antd";
import type { MenuProps } from "antd";
import toast from "react-hot-toast";
import { openSettingsDrawer } from "../../slice/UI/UiSlice";

const { Header } = Layout;

export const Headers = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Deconnexion réussie!");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Account",
      icon: <UserOutlined />,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Settings",
      icon: <SettingOutlined />,
      extra: "⌘S",
      onClick: () => dispatch(openSettingsDrawer()),
    },
    {
      key: "3",
      label: (
        <Popconfirm
          title="Logout"
          description="Are you sure you want to disonnect account?"
          onConfirm={handleLogout}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <span>
            <LoginOutlined /> Logout ⌘D
          </span>
        </Popconfirm>
      ),
    },
  ];

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-between p-4 bg-white shadow">
  //       <div className="animate-pulse flex space-x-4">
  //         <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
  //         <div className="space-y-2">
  //           <div className="h-4 w-24 bg-gray-200 rounded"></div>
  //           <div className="h-4 w-32 bg-gray-200 rounded"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  useEffect(() => {
    if (!user) {
      console.log("Redirection vers /login car pas d'utilisateur");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Header
      className="flex justify-between items-center py-4"
      style={{
        padding: 0,
        background: colorBgContainer,
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <div style={{ width: 64, minHeight: 42 }}>
        <Button
          className=""
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 42,
            height: 42,
            color: "white",
            backgroundColor: "royalblue",
          }}
        />
      </div>
      {/* <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginRight: 24 }}
          >
            Déconnexion
          </Button> */}
      <div className="flex justify-end items-center py-4 mr-7">
        <div className="flex items-center">
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {user?.name?.charAt(0) || ""}
                    {user?.surname?.charAt(0) || ""}
                  </span>
                </div>
              </Space>
            </a>
          </Dropdown>

          <div className="ml-4 d-flex row gap-2">
            <div className="text-lg font-medium text-gray-900">
              {user.name} {user.surname}
            </div>
            <div className="text-xs text-gray-400">Rôle: {user.role}</div>
          </div>
        </div>
      </div>
    </Header>
  );
};
