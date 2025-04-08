import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();

export const trimVideo = async (file: File, startTime: number, endTime: number): Promise<Blob> => {
  // Load FFmpeg
  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.15/dist/ffmpeg-core.js',
    });
  }

  const inputFileName = 'input.mp4';
  const outputFileName = 'output.mp4';

  // Write the input file to FFmpeg's file system
  await ffmpeg.writeFile(inputFileName, await fetchFile(file));

  // Run the FFmpeg command to trim the video
  await ffmpeg.exec([
    '-i', inputFileName,
    '-ss', startTime.toString(),
    '-to', endTime.toString(),
    '-c', 'copy',
    outputFileName,
  ]);

  // Read the output file
  const data = await ffmpeg.readFile(outputFileName);
  return new Blob([data], { type: 'video/mp4' });
};