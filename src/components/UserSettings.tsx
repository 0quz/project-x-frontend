import React from "react";
import { Layout, Avatar, Dropdown, MenuProps } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";

const { Header } = Layout;

interface User {
    avatar?: string;
    username?: string;
}

interface Props {
  onDone: () => void;
}

const UserSettings: React.FC<User & Props> = ({ onDone, avatar, username }) => {
  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        "Profile"
      ),
    },
    {
      key: 'settings',
      label: (
        "Settings"
      ),
      icon: <SettingOutlined />,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: async () => {
        const res = await axios.post("http://localhost:8080/auth/google/logout", {}, {
          withCredentials: true,
        })
        if (res.status === 200) {
          onDone();
        }
      },
      label: (
        "Logout"
      ),
    }
  ];

  return (
    <Dropdown menu={{items}} trigger={["click"]}>
      <Avatar 
        style={{ 
          cursor: "pointer",
          backgroundColor: avatar ? undefined : '#1890ff' 
        }} 
        size="large" 
        src={avatar} 
        icon={!avatar && <UserOutlined/>} 
      />
    </Dropdown>
  );
};

export default UserSettings;
