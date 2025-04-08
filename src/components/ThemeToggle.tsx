import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <Button
        type="text"
        icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
        onClick={onToggle}
        style={{ fontSize: '16px' }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;