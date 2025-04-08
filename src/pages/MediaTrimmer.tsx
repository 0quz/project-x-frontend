import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  Button, Slider, Typography, Upload, message, Spin, 
  Divider, Input, Form, Card, Progress, Space, Row, Col 
} from 'antd';
import { 
  UploadOutlined, DownloadOutlined, PlayCircleOutlined, 
  PauseCircleOutlined, DeleteOutlined, UndoOutlined 
} from '@ant-design/icons';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Text, Title } = Typography;
const ffmpeg = new FFmpeg();
const MAX_TRIM_DURATION = 10; // Maximum trim duration in seconds

const MediaTrimmer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mediaURL, setMediaURL] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [trimRange, setTrimRange] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(false);
  const [trimmedURL, setTrimmedURL] = useState<string>('');
  const mediaRef = useRef<HTMLMediaElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewingStart, setIsPreviewingStart] = useState(false);
  const [thumbnail, setThumbnail] = useState<UploadFile | null>(null);
  const [mediaName, setMediaName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const handleUpload = (selectedFile: File) => {
    if (!selectedFile) return;

    const isVideoFile = selectedFile.type.startsWith('video');
    const isAudioFile = selectedFile.type.startsWith('audio');

    if (!isVideoFile && !isAudioFile) {
      message.error('Please upload a video or audio file');
      return;
    }

    // Add file size check
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      message.error('File size cannot exceed 100MB');
      return;
    }
  
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setMediaURL(url);
    setTrimmedURL(''); // Reset trimmed preview when new file is uploaded
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      const mediaDuration = mediaRef.current.duration;
      setDuration(mediaDuration);
      setTrimRange([0, Math.min(MAX_TRIM_DURATION, mediaDuration)]);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current && !isDragging) {
      const currentTime = mediaRef.current.currentTime;
      setCurrentTime(currentTime);
      
      // Stop playback if current time exceeds trim range end
      if (currentTime >= trimRange[1]) {
        mediaRef.current.pause();
        mediaRef.current.currentTime = trimRange[1];
        setIsPreviewingStart(false);
      }
    }
  };

  const handlePlay = () => {
    if (mediaRef.current) {
      // If current time is beyond trim range, reset to start
      if (mediaRef.current.currentTime >= trimRange[1]) {
        mediaRef.current.currentTime = trimRange[0];
      }
    }
  };

  const handleRangeChange = (value: [number, number]) => {
    const [start, end] = value;
    if (end - start <= MAX_TRIM_DURATION) {
      setTrimRange(value);
      // Seek to the start position when slider changes
      if (mediaRef.current) {
        mediaRef.current.currentTime = start;
      }
    } else {
      message.warning(`Maximum trim duration is ${MAX_TRIM_DURATION} seconds`);
    }
  };

  const handleAfterRangeChange = (value: [number, number]) => {
    const [start] = value;
    if (mediaRef.current) {
      mediaRef.current.currentTime = start;
    }
  };

  const handlePreviewToggle = useCallback(() => {
    if (!mediaRef.current) return;

    if (isPreviewingStart) {
      // Stop preview
      mediaRef.current.pause();
      setIsPreviewingStart(false);
    } else {
      // Start preview
      mediaRef.current.currentTime = trimRange[0];
      mediaRef.current.play();
      setIsPreviewingStart(true);
    }
  }, [trimRange, isPreviewingStart]);

  const handleTrim = async () => {
    if (!file) return;
    
    const [start, end] = trimRange;
    if (end <= start) {
      //message.error('End time must be greater than start time');
      return;
    }

    setLoading(true);
    try {
      if (!ffmpeg.loaded) {
        await ffmpeg.load();
      }

      const inputName = file.name;
      const extension = inputName.split('.').pop() || 'mp4';
      const outputName = `trimmed.${extension}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec([
        '-ss', String(start),
        '-i', inputName,
        '-t', String(end - start),
        '-c', 'copy',
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const trimmedBlob = new Blob([data], { type: file.type });
      const newTrimmedURL = URL.createObjectURL(trimmedBlob);
      setTrimmedURL(newTrimmedURL);

      message.success('Media trimmed successfully!');
    } catch (error) {
      message.error('Failed to trim media');
      console.error('Trim error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!trimmedURL) return;

    const extension = file?.name.split('.').pop() || 'mp4';
    const link = document.createElement('a');
    link.href = trimmedURL;
    link.download = `trimmed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isVideo = file?.type.startsWith('video');

  const handleThumbnailUpload = (info: UploadChangeParam<UploadFile>) => {
    console.log('Upload info:', info);
    
    // Check if we have a file
    if (info.fileList && info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      console.log('File object:', file);
      
      if (file) {
        setThumbnail(info.fileList[0]);
        // Create and set the preview URL
        const previewUrl = URL.createObjectURL(file);
        console.log('Preview URL created:', previewUrl);
        setThumbnailPreview(previewUrl);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup thumbnail preview URL when component unmounts
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleUploadToServer = async () => {
    if (!trimmedURL || !mediaName) {
      message.error('Please provide media name');
      return;
    }

    setIsUploading(true);
    try {
      // Get the blob data using axios instead of fetch
      const response = await axios.get(trimmedURL, {
        responseType: 'blob'
      });
      
      const blob = response.data;
      const trimmedFile = new File([blob], `${mediaName}.${file?.name.split('.').pop() || 'mp4'}`, { type: file?.type });
      
      const formData = new FormData();
      
      // Only include thumbnail if it's an audio file and thumbnail exists
      if (!isVideo && thumbnail) {
        formData.append('media', trimmedFile);
        formData.append('name', mediaName);
        formData.append('thumbnail', thumbnail.originFileObj as File);
      } else {
        formData.append('media', trimmedFile);
        formData.append('name', mediaName);
      }

      const uploadResponse = await axios.post('http://localhost:8080/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      console.log(uploadResponse);

      if (uploadResponse.status !== 200) {
        throw new Error('Upload failed');
      }

      message.success('Media uploaded successfully!');
      
      // Reset form
      setMediaName('');
      setThumbnail(null);
      setTrimmedURL('');
      setFile(null);
      setMediaURL('');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const resetAll = () => {
    setMediaName('');
    setThumbnail(null);
    setTrimmedURL('');
    setFile(null);
    setMediaURL('');
    setTrimRange([0, 0]);
    setDuration(0);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview('');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <Card>
        <Title level={4}>Media Trimmer</Title>
        <Text type="secondary">Upload and trim your media files. Maximum duration: {MAX_TRIM_DURATION} seconds</Text>
        
        {!trimmedURL ? (
          <div style={{ marginTop: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Upload
                accept="video/*,audio/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} size="large" type="primary">
                  Select Media File
                </Button>
              </Upload>

              {mediaURL && (
                <Spin spinning={loading} tip="Processing...">
                  <Card title="Original Media" size="small">
                    {isVideo ? (
                      <video
                        ref={mediaRef as React.RefObject<HTMLVideoElement>}
                        src={mediaURL}
                        controls
                        width="100%"
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={handlePlay}
                        style={{ borderRadius: 8 }}
                      />
                    ) : (
                      <audio
                        ref={mediaRef as React.RefObject<HTMLAudioElement>}
                        src={mediaURL}
                        controls
                        style={{ width: '100%' }}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={handlePlay}
                      />
                    )}

                    <div style={{ marginTop: 16 }}>
                      <Row align="middle" justify="space-between">
                        <Col>
                          <Text strong>Trim Range:</Text>
                          <Text> {formatTime(trimRange[0])} - {formatTime(trimRange[1])}</Text>
                        </Col>
                        <Col>
                          <Text type="secondary">Duration: {formatTime(trimRange[1] - trimRange[0])}</Text>
                        </Col>
                      </Row>
                      
                      <Slider
                        range
                        min={0}
                        max={duration}
                        value={trimRange}
                        onChange={handleRangeChange}
                        onAfterChange={handleAfterRangeChange}
                        step={0.1}
                        tooltip={{ formatter: formatTime }}
                        style={{ marginTop: 8 }}
                      />
                      
                      <Space style={{ marginTop: 16 }}>
                        <Button 
                          icon={isPreviewingStart ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                          onClick={handlePreviewToggle}
                        >
                          {isPreviewingStart ? 'Stop Preview' : 'Preview Trim'}
                        </Button>
                        <Button
                          type="primary"
                          onClick={handleTrim}
                          disabled={loading}
                          loading={loading}
                        >
                          {loading ? 'Trimming...' : 'Trim Media'}
                        </Button>
                      </Space>
                    </div>
                  </Card>
                </Spin>
              )}
            </Space>
          </div>
        ) : (
          <div>
            <Card title="Trimmed Preview" extra={
              <Button icon={<UndoOutlined />} onClick={resetAll}>
                Start Over
              </Button>
            }>
              {isVideo ? (
                <video src={trimmedURL} controls width="100%" style={{ borderRadius: 8 }} />
              ) : (
                <audio src={trimmedURL} controls style={{ width: '100%' }} />
              )}
              
              <Form layout="vertical" style={{ marginTop: 24 }}>
                <Row gutter={24}>
                  <Col span={isVideo ? 24 : 12}>
                    <Form.Item 
                      label="Media Name" 
                      required 
                      rules={[{ required: true, message: 'Please enter a name' }]}
                    >
                      <Input
                        placeholder="Enter media name"
                        value={mediaName}
                        onChange={(e) => setMediaName(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  
                  {!isVideo && (
                    <Col span={12}>
                      <Form.Item label="Thumbnail">
                        <Upload
                          accept="image/*,gif"
                          maxCount={1}
                          onChange={handleThumbnailUpload}
                          beforeUpload={() => false}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} block>
                            {thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                          </Button>
                        </Upload>
                        
                        {thumbnailPreview && (
                          <div style={{ marginTop: 16, position: 'relative' }}>
                            <img 
                              src={thumbnailPreview}
                              alt="Thumbnail preview" 
                              style={{ 
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 8
                              }}
                            />
                            <Button 
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                setThumbnail(null);
                                setThumbnailPreview('');
                              }}
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8
                              }}
                            />
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                  )}
                </Row>

                <Space>
                  <Button
                    type="primary"
                    onClick={handleUploadToServer}
                    loading={isUploading}
                    disabled={!mediaName || !trimmedURL}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Media'}
                  </Button>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                </Space>
              </Form>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MediaTrimmer;
