import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

const Header: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Account",
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
    },
  ];

  console.log("État de chargement dans Header:", isLoading);
  console.log("Données utilisateur dans Header:", user);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("Redirection vers /login car pas d'utilisateur");
    navigate("/login");
    return null;
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {user.name.charAt(0)}
                      {user.surname.charAt(0)}
                    </span>
                  </div>
                </Space>
              </a>
            </Dropdown>

            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">
                {user.name} {user.surname}
              </h2>
              <p className="text-sm text-gray-500">{user.mail}</p>
              <p className="text-xs text-gray-400">Rôle: {user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
