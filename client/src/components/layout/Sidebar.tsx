import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../assets/sidebar.css";
import {
  UserOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined,
  UserAddOutlined,
  BranchesOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  path?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    path,
  } as MenuItem;
}

{
  /* <BranchesOutlined />; */
}
const menuComponentStyle = { fontSize: "20px" };
const items: MenuItem[] = [
  getItem(
    "Dashboard",
    "1",
    <DesktopOutlined style={menuComponentStyle} />,
    undefined,
    "/"
  ),
  getItem(
    "Add User",
    "2",
    <UserAddOutlined style={menuComponentStyle} />,
    undefined,
    "/addUser"
  ),
  getItem(
    "Add Branch",
    "11",
    <BranchesOutlined style={menuComponentStyle} />,
    undefined,
    "/addBranch"
  ),
  getItem("Manage User", "sub1", <UserOutlined style={menuComponentStyle} />, [
    getItem(
      "Administrators",
      "3",
      undefined,
      undefined,
      "/userlist/Administrateur"
    ),
    getItem("Parents", "4", undefined, undefined, "/userlist/Parent"),
    getItem("Students", "5", undefined, undefined, "/userlist/Student"),
    getItem("Teacher", "6", undefined, undefined, "/userlist/Teacher"),
  ]),
  getItem(
    "Manage Branchs",
    "12",
    <BranchesOutlined style={menuComponentStyle} />,
    undefined,
    "/branchList"
  ),
  getItem("Team", "sub2", <TeamOutlined style={menuComponentStyle} />, [
    getItem("Team 1", "7"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined style={menuComponentStyle} />),
  getItem("Option 1", "10", <PieChartOutlined style={menuComponentStyle} />),
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour trouver la clé correspondant au chemin actuel
  const findKeyByPath = (
    items: MenuItem[],
    currentPath: string
  ): string | undefined => {
    for (const item of items) {
      if (item.path === currentPath) return item.key as string;
      if (item.children) {
        const keyInChildren = findKeyByPath(item.children, currentPath);
        if (keyInChildren) return keyInChildren;
      }
    }
    return undefined;
  };

  // Mettre à jour la sélection quand l'URL change
  useEffect(() => {
    const currentPath = location.pathname;
    const key = findKeyByPath(items, currentPath);
    if (key) {
      setSelectedKeys([key]);

      // Trouver aussi la clé du parent si c'est un sous-menu
      const findParentKey = (
        items: MenuItem[],
        childKey: string
      ): string | undefined => {
        for (const item of items) {
          if (item.children) {
            const found = item.children.some((child) => child.key === childKey);
            if (found) return item.key as string;
            const parentKey = findParentKey(item.children, childKey);
            if (parentKey) return parentKey;
          }
        }
        return undefined;
      };

      const parentKey = findParentKey(items, key);
      if (parentKey) {
        setSelectedKeys((prev) => [...prev, parentKey]);
      }
    }
  }, [location.pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const findPath = (
      items: MenuItem[],
      targetKey: string
    ): string | undefined => {
      for (const item of items) {
        if (item.key === targetKey && item.path) return item.path;
        if (item.children) {
          const pathInChildren = findPath(item.children, targetKey);
          if (pathInChildren) return pathInChildren;
        }
      }
    };

    const path = findPath(items, key);
    if (path) navigate(path);
  };

  return (
    <Sider
      style={siderStyle}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={"250px"}
    >
      <div className="demo-logo-vertical mt-7" />
      <Menu
        theme="dark"
        selectedKeys={selectedKeys}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
        className="[&_.ant-menu-item]:text-white [&_.ant-menu-item]:text-lg [&_.ant-menu-submenu-title]:text-white [&_.ant-menu-submenu-title]:text-lg [&_.ant-menu-item-group-list_.ant-menu-item]:text-white [&_.ant-menu-item-group-list_.ant-menu-item]:text-base"
      />
    </Sider>
  );
};
