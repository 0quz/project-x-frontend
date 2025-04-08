import React from 'react';

interface UploadButtonProps {
  videoBlob: Blob | null;
  onUpload: (file: File) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ videoBlob, onUpload }) => {
  const handleUpload = () => {
    if (videoBlob) {
      const file = new File([videoBlob], 'trimmed-video.mp4', { type: 'video/mp4' });
      onUpload(file);
    }
  };

  return (
    <div>
      <button onClick={handleUpload} disabled={!videoBlob}>
        Upload Trimmed Video
      </button>
    </div>
  );
};

export default UploadButton;