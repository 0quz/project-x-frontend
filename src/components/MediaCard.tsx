import { Card, Typography, Space, Tag, Tooltip, Avatar } from 'antd';
import AudioPlayerWithImage from './AudioPlayer';
import CardDropDownMenu from './CardDropDownMenu';
import PlayOnStream from './PlayOnStream';
import { User } from '../pages/Discover';
import { formatDistanceToNow } from 'date-fns';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Text, Paragraph } = Typography;

const cardStyle = {
  width: 200,
  margin: "8px",
  borderRadius: "12px",
  overflow: "hidden",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  border: "1px solid #f0f0f0",
  ":hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
  }
};

const coverStyle = {
  aspectRatio: "1/1",
  objectFit: "cover" as const,
  width: "100%",
  height: "200px",
};

export interface Media {
  id: number;
  name: string;
  url: string;
  created_by_name: string;
  description: string;
  audio_url: string;
  price?: number;
  media_name?: string;
  username?: string;
  streamers?: User[];
  created_at?: string;
}

const MediaCard: React.FC<Media> = (media) => {
  const isEditorView = media.media_name;
  const formattedDate = media.created_at 
    ? formatDistanceToNow(new Date(media.created_at), { addSuffix: true })
    : null;

  const title = isEditorView ? media.media_name : media.name;
  const description = media.description || "No description available";

  return (
    <Card
      style={cardStyle}
      bodyStyle={{ 
        padding: '12px',
        height: isEditorView ? '80px' : '120px',
      }}
      loading={false}
      hoverable
      cover={
        <div style={{ position: 'relative' }}>
          <AudioPlayerWithImage 
            imageUrl={media.url} 
            audioUrl={media.audio_url}
            style={coverStyle}
          />
          {media.price && (
            <Tag 
              color="blue"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                margin: 0,
                padding: '4px 8px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Price: {media.price}
            </Tag>
          )}
        </div>
      }
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Tooltip title={title}>
            <Text strong style={{ 
              fontSize: '14px',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '4px'
            }}>
              {title}
            </Text>
          </Tooltip>

          {!isEditorView && (
            <Tooltip title={description}>
              <Paragraph
                type="secondary"
                style={{ 
                  fontSize: '12px',
                  margin: '0 0 4px 0',
                  height: '32px'
                }}
                ellipsis={{ rows: 2 }}
              >
                {description}
              </Paragraph>
            </Tooltip>
          )}
        </div>

        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto'
        }}>
          {!isEditorView ? (
            <Space size={4}>
              <Avatar 
                size="small" 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Tooltip title={`Created by ${media.created_by_name}`}>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {media.created_by_name}
                </Text>
              </Tooltip>
            </Space>
          ) : (
            <PlayOnStream key={media.id} {...media} />
          )}

          {!isEditorView && (
            <Space size={4}>
              {formattedDate && (
                <Tooltip title={new Date(media.created_at!).toLocaleString()}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {formattedDate}
                  </Text>
                </Tooltip>
              )}
              <CardDropDownMenu 
                id={media.id} 
                name={media.name} 
                streamers={media.streamers}
              />
            </Space>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MediaCard;
