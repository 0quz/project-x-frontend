import React, { useRef, useState } from "react";
import { Button } from "antd";
import { PlaySquareOutlined, PauseOutlined } from "@ant-design/icons";

export interface Source {
    imageUrl: string;
    audioUrl: string;
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

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <img
        src={Source.imageUrl} // Replace with your image URL
        alt="Audio Player"
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "8px",
          display: "block"
        }}
      />

      {/* Centered Play/Pause Button */}
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

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={Source.audioUrl} />
    </div>
  );
};

export default AudioPlayerWithImage;