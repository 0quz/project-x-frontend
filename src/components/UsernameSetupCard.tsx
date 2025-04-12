import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Card, Typography, Alert } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Text, Link } = Typography;

const UsernameSetupCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get<{username: string}>("http://localhost:8080/users/username", {
      headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}
    }).then((res) => {
      setUsername(res.data.username);
    });
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      await axios.patch(
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

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${username}`);
  };

  const url = `${window.location.origin}/${username}`;

  return (
    <Card 
      title="Streamer Setup"
      style={{ width: '100%', maxWidth: 600 }}
    >
      <Alert
        message="Your Media. Share this with your contributors."
        description={
          <div style={{ marginTop: 8 }}>
            <Link href={url} target="_blank" style={{ wordBreak: 'break-all' }}>
              {url}
            </Link>
            <div style={{ marginTop: 8 }}>
              <Button 
                icon={<CopyOutlined />}
                type="primary"
                onClick={handleCopy}
                style={{ marginRight: 8 }}
              >
                Copy URL
              </Button>
              <Button 
                type="link" 
                onClick={showModal}
              >
                Change Username
              </Button>
            </div>
          </div>
        }
        type="success"
        showIcon
      />

      <Modal 
        title={"Change Username"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText={"Update"}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>
            Your username will be used to create your unique media URL:
            <br />
            <Text strong>{window.location.origin}/[username]</Text>
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
