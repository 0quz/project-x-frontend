import React, { useEffect, useRef, useState } from "react";
import { Button, Image } from "antd";
import { PlaySquareOutlined, PauseOutlined } from "@ant-design/icons";

export interface Source {
    imageUrl: string;
    audioUrl: string;
    style?: any;
}

const AudioPlayerWithImage: React.FC<Source> = (Source) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (!isHovered && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(!isPlaying);
      }
    }
  }, [isHovered]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={Source.imageUrl}
        alt="Audio Player"
        style={Source.style ? Source.style : {
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          display: "block"
        }}
      />

      {isHovered && (
        <Button
          type="text"
          shape="circle"
          icon={
            isPlaying ? (
              <PauseOutlined style={{ fontSize: 80, color: "white" }} />
            ) : (
              <PlaySquareOutlined style={{ fontSize: 80, color: "white" }} />
            )
          }
          onClick={togglePlay}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
      )}

      {Source.audioUrl && (
        <audio ref={audioRef} src={Source.audioUrl} />
      )}
    </div>
  );
};

export default AudioPlayerWithImage;
