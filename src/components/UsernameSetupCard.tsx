import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Card, Typography, Alert } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Text } = Typography;

export interface Config {
  title: string;
  content: string;
}

const UsernameSetupCard: React.FC<Config> = (Config) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get<{username: string}>("http://localhost:8080/users/username", {
      headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}
    }).then((res) => {
      setUsername(res.data.username ? res.data.username : '');
    });
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:8080/users/username",
        { username: username },
        {
          headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}
        }
      );
      setIsModalOpen(false);
    } catch (error: any) {
      Modal.error({
        title: 'Error',
        content: error.response?.data?.message || 'Failed to update username'
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Card 
      title={Config.title || "Username Setup"} 
      style={{ width: '100%', maxWidth: 400 }}
    >
      {!username ? (
        <>
          <Alert
            message="Username Required"
            description="Setting up a username is required to access your media URLs and share content with editors. Your media will be accessible at: your-domain.com/[username]/media"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" onClick={showModal} block>
            Set Up Username
          </Button>
        </>
      ) : (
        <>
          <Alert
            message="Username Configured"
            description={
              <div>
                <Text>Your content is accessible at:</Text>
                <Text strong> your-domain.com/{username}</Text>
                <br />
                <Text type="secondary">Share this URL with your editors and viewers.</Text>
              </div>
            }
            type="success"
            showIcon
          />
          <Button 
            type="link" 
            onClick={showModal} 
            style={{ padding: '8px 0' }}
          >
            Change Username
          </Button>
        </>
      )}

      <Modal 
        title={username ? "Change Username" : "Set Up Username"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText={username ? "Update" : "Set Username"}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>
            Your username will be used to create your unique media URL:
            <br />
            <Text strong>your-domain.com/[username]/media</Text>
          </Text>
        </div>
        <Input
          id="username"
          type="text"
          value={username}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginTop: 8 }}
        />
      </Modal>
    </Card>
  );
};

export default UsernameSetupCard;
