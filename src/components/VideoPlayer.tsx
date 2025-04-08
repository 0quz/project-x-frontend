import React, { useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onDurationChange: (duration: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onDurationChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      onDurationChange(videoRef.current.duration);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        controls
        width="100%"
        src={videoUrl}
        onLoadedMetadata={handleLoadedMetadata}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;