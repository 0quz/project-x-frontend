import {Card} from 'antd';
import AudioPlayerWithImage from './AudioPlayer';
import CardDropDownMenu from './CardDropDownMenu';
const { Meta } = Card;

const cardStyle = {
  width: 200, // Adjust the width of the cards
  margin: "10px", // Add some spacing between cards
};

export interface Media {
  id?: number;
  name: string;
  url: string;
  created_by_name: string;
  description: string;
  audio_url: string;
}

const MediaCard: React.FC<Media> = (Media) => (
  <Card
    title={Media.created_by_name || "user-name"}
    extra={<CardDropDownMenu id={Media.id}/>}
    style={cardStyle}
    loading={false}
    hoverable={true}
    //onMouseOver={showPlayer}
    cover={
      <AudioPlayerWithImage imageUrl={Media.url} audioUrl={Media.audio_url} />
    }
    actions={[
      //<EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      //avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
      title={Media.name || "media-name"}
      description= {Media.description || "This is the description"}
    />
  </Card>
);


export default MediaCard;
