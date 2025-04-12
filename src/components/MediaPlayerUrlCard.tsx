import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Alert } from 'antd';
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Text } = Typography;

const MediaPlayerUrlCard: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isUrlVisible, setIsUrlVisible] = useState(false);

  useEffect(() => {
    axios.get<{ token: string }>(`http://localhost:8080/users/media-player-token`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    }).then((res) => {
      setToken(res.data.token);
    });
  }, []);

  const playerUrl = `${window.location.origin}/media/player/${token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(playerUrl);
  };

  const toggleUrlVisibility = () => {
    setIsUrlVisible(!isUrlVisible);
  };

  return (
    <Card 
      title="Media Player URL" 
      style={{ width: '100%', maxWidth: 600 }}
    >
      <Alert
        message="OBS Browser Source URL"
        description={
          <div style={{ marginTop: 8 }}>
            <Text style={{ wordBreak: 'break-all' }}>
              {isUrlVisible ? playerUrl : '********************************'}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Button 
                icon={isUrlVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={toggleUrlVisibility}
                style={{ marginRight: 8 }}
              >
                {isUrlVisible ? 'Hide URL' : 'Show URL'}
              </Button>
              <Button 
                icon={<CopyOutlined />}
                type="primary"
                onClick={handleCopy}
              >
                Copy URL
              </Button>
            </div>
          </div>
        }
        type="info"
        showIcon
      />
    </Card>
  );
};

export default MediaPlayerUrlCard;

