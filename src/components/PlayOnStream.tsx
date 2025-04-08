import { Button, Popconfirm } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { Media } from "./MediaCard";
import Cookies from "js-cookie";
import { message } from "antd";

const PlayOnStream: React.FC<Media> = (userMedia) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const playOnStream = async ()  => {
    setConfirmLoading(true);
    const res = await axios.post<Media>("http://localhost:8080/media/player", {
      media: userMedia,
      username: userMedia.username,
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get("token")}`,
      },
    }).catch((err) => {
      message.error(err.response.data.message);
    });
    setOpen(false);
    setConfirmLoading(false);
  };

  const showPopconfirm = () => {
    setOpen(true);
  };


  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  const description = `This will cost you ${userMedia?.price ?? 0} points.`;
  return (
    // <Button 
    //   style={{ width: "100%" }} 
    //   type="primary" 
    //   onClick={playOnStream}
    // >
    //   Play {userMedia.username}'s Stream
    // </Button>
      <Popconfirm
        title="Are you sure?"
        description={description}
        open={open}
        onConfirm={playOnStream}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
      >
        <Button style ={{ width: "100%" }} type="primary" onClick={showPopconfirm}>
        Play {userMedia.username}'s Stream
        </Button>
    </Popconfirm>
  );
};

export default PlayOnStream;
