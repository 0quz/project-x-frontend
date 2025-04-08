import React, { useState, useEffect } from 'react';

interface TrimmerControlsProps {
  duration: number;
  onTrim: (start: number, end: number) => void;
}

const TrimmerControls: React.FC<TrimmerControlsProps> = ({ duration, onTrim }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(duration);

  // Update endTime when duration changes
  useEffect(() => {
    setEndTime(duration);
  }, [duration]);

  const handleTrim = () => {
    onTrim(startTime, endTime);
  };

  return (
    <div>
      <label>
        Start Time:
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={startTime}
          onChange={(e) => setStartTime(Number(e.target.value))}
        />
        {startTime.toFixed(2)}s
      </label>
      <label>
        End Time:
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={endTime}
          onChange={(e) => setEndTime(Number(e.target.value))}
        />
        {endTime.toFixed(2)}s
      </label>
      <button onClick={handleTrim}>Trim Video</button>
    </div>
  );
};

export default TrimmerControls;