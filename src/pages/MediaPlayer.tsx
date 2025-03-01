import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const WS_URL = 'ws://localhost:8080';

interface Media {
  name: string;
  url: string;
  length: string;
}

const MediaPlayer = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { token } = useParams<{ token: string }>();
  const [mediaPlayerToken, setMediaPlayerToken] = useState(token); // set this dynamically
  const [mediaSrc, setMediaSrc] = useState<Media | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      socket.send(JSON.stringify({ mediaPlayerToken }));
      console.log('Connected & registered.');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMediaSrc(data.media);
      console.log('Received:', data);
    };

    socket.onclose = () => console.log('Disconnected from WS.');

    setWs(socket);

    return () => socket.close();
  }, [mediaPlayerToken]);

  return (
    <div>
       {mediaSrc ? (
        <div>
          <img src={mediaSrc.url} alt="Triggered GIF" />
        </div>
      ) : (
        <p>Waiting for media...</p>
      )}
    </div>
  );
}

export default MediaPlayer;