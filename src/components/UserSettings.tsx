import React from "react";
import { Layout, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const UserSettings: React.FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 16px", background: "#fff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Avatar style={{ cursor: "pointer" }} size="large" icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
};

export default UserSettings;