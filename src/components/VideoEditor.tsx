// import React, { useState, useRef } from 'react';
// import ReactPlayer from 'react-player';
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
// import { FFmpeg } from '@ffmpeg/ffmpeg';

// const MediaTrimEditor: React.FC = () => {
//   const [videoUrl, setVideoUrl] = useState<string>('');
//   const [startTime, setStartTime] = useState<number>(0);
//   const [endTime, setEndTime] = useState<number>(0);
//   const [duration, setDuration] = useState<number>(0);
//   const [trimmedVideoUrl, setTrimmedVideoUrl] = useState<string>('');
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const playerRef = useRef<ReactPlayer>(null);
//   const ffmpegRef = useRef(new FFmpeg());

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setVideoUrl(url);
//       setTrimmedVideoUrl(''); // Reset trimmed video URL
//     }
//   };

//   const handleDuration = (duration: number) => {
//     setDuration(duration);
//     setEndTime(duration);
//   };

//   const handleSliderChange = (value: number | number[]) => {
//     if (Array.isArray(value)) {
//       setStartTime(value[0]);
//       setEndTime(value[1]);
//     }
//   };

//   const handleSeek = (time: number) => {
//     if (playerRef.current) {
//       playerRef.current.seekTo(time, 'seconds');
//     }
//   };

//   const handleTrim = async () => {
//     if (!videoUrl || isProcessing) return;

//     setIsProcessing(true);
//     const ffmpeg = ffmpegRef.current;

//     // Load FFmpeg
//     if (!ffmpeg.loaded) {
//       await ffmpeg.load();
//     }

//     // Fetch the video file
//     const response = await fetch(videoUrl);
//     const videoBlob = await response.blob();
//     const videoArrayBuffer = await videoBlob.arrayBuffer();

//     // Write the video file to FFmpeg's file system
//     await ffmpeg.writeFile('input.mp4', new Uint8Array(videoArrayBuffer));

//     // Run FFmpeg command to trim the video
//     await ffmpeg.exec([
//       '-i', 'input.mp4',
//       '-ss', startTime.toString(), // Start time
//       '-to', endTime.toString(),   // End time
//       '-c', 'copy',               // Copy codec (no re-encoding)
//       'output.mp4'
//     ]);

//     // Read the trimmed video file
//     const outputData = await ffmpeg.readFile('output.mp4');
//     const outputBlob = new Blob([outputData], { type: 'video/mp4' });
//     const outputUrl = URL.createObjectURL(outputBlob);

//     setTrimmedVideoUrl(outputUrl);
//     setIsProcessing(false);
//   };

//   const handleDownload = () => {
//     if (!trimmedVideoUrl) return;

//     const link = document.createElement('a');
//     link.href = trimmedVideoUrl;
//     link.download = 'trimmed-video.mp4';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div>
//       <input type="file" accept="video/*" onChange={handleFileChange} />
//       {videoUrl && (
//         <div>
//           <ReactPlayer
//             ref={playerRef}
//             url={videoUrl}
//             controls
//             onDuration={handleDuration}
//           />
//           <div>
//             <Slider
//               min={0}
//               max={duration}
//               value={[startTime, endTime]}
//               onChange={handleSliderChange}
//               range
//             />
//           </div>
//           <div>
//             <button onClick={() => handleSeek(startTime)}>Go to Start</button>
//             <button onClick={() => handleSeek(endTime)}>Go to End</button>
//             <button onClick={handleTrim} disabled={isProcessing}>
//               {isProcessing ? 'Processing...' : 'Trim Video'}
//             </button>
//           </div>
//         </div>
//       )}
//       {trimmedVideoUrl && (
//         <div>
//           <h3>Trimmed Video Preview</h3>
//           <ReactPlayer url={trimmedVideoUrl} controls />
//           <button onClick={handleDownload}>Download Trimmed Video</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MediaTrimEditor;

