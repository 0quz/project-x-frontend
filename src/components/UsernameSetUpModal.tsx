import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const res = await axios.patch("http://localhost:8080/users/username", {username: username}, {
      headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}
    });
    console.log(res.data);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Set Up
      </Button>
      <Modal title="Add or Change" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Add Username to your account </p> <Input id="username" type="text" value={username} placeholder="Enter an username" onChange={(e) => setUsername(e.target.value)}/>
      </Modal>
    </>
  );
};

export default App;