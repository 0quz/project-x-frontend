import axios from "axios";
import { useState, useEffect } from 'react';
import { Input, List, Divider, Select, Flex, Skeleton, Empty, Alert, Typography, Space } from 'antd';
import MediaCard, { Media } from '../components/MediaCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'js-cookie';
import { SearchOutlined, OrderedListOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Title } = Typography;

export interface User {
    id: number;
    username: string;
    email: string;
    avatar: string;
}

const App: React.FC = () => {
    const [streamers, setStreamers] = useState<User[]>([]);
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const getMedia = async () => {
        if (!hasMore) return;
        
        try {
            const response = await axios.get<Media[]>("http://localhost:8080/media", {
                params: { 
                    lastTimestamp: media.length > 0 ? media[media.length - 1].created_at : undefined
                }
            });
            
            const newMedia = response.data;
            if (newMedia.length === 0) {
                setHasMore(false);
            } else {
                setMedia(prev => [...prev, ...newMedia]);
            }
        } catch (err) {
            setError("Failed to fetch media content");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStreamers = async () => {
        if (Cookies.get("token")) {
            try {
                const res = await axios.get<User[]>("http://localhost:8080/users/streamers", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    },
                });
                setStreamers(res.data);
            } catch (err) {
                console.error("Failed to fetch streamers", err);
            }
        }
    };

    useEffect(() => {
        getMedia();
        getStreamers();
    }, []);

    const searchMedia = async (searchTerm: string) => {
        setLoading(true);
        try {
            const response = await axios.get<Media[]>("http://localhost:8080/media", {
                params: { search: searchTerm }
            });
            setMedia(response.data);
            setHasMore(false); // Disable infinite scroll during search
        } catch (err) {
            setError("Search failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sortMedia = async (sort: string) => {
        setLoading(true);
        try {
            const response = await axios.get<Media[]>("http://localhost:8080/media", {
                params: { sort }
            });
            setMedia(response.data);
            setHasMore(false); // Disable infinite scroll during sorting
        } catch (err) {
            setError("Failed to sort media");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetMedia = () => {
        setMedia([]);
        setHasMore(true);
        setError(null);
        getMedia();
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>            
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    closable
                    onClose={() => setError(null)}
                    style={{ marginBottom: '16px' }}
                />
            )}
            <Flex 
                // style={{ 
                //     position: 'fixed',
                //     top: 64, // Align with the top navbar
                //     left: 200, // Match sidebar width
                //     right: 24, // Add right padding
                //     padding: '16px 0',
                //     background: localStorage.getItem('darkMode') === 'true' ? '#141414' : 'white',
                //     zIndex: 1,
                //     transition: 'all 0.2s', // Match sidebar transition
                // }} 
                justify="space-between" 
                // align="center" 
                // wrap="wrap" 
                // gap={16}
            >
                <Search
                    placeholder="Search media..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    style={{ width: '100%', maxWidth: 400 }}
                    onSearch={searchMedia}
                    onChange={(e) => !e.target.value && resetMedia()}
                />
                
                <Select
                    size="large"
                    style={{ width: '100%', maxWidth: 300 }}
                    placeholder="Sort by..."
                    suffixIcon={<OrderedListOutlined />}
                    defaultValue="created_at DESC"
                    options={[
                        { value: 'created_at DESC', label: 'Newest First' },
                        { value: 'created_at ASC', label: 'Oldest First' },
                        { value: 'name ASC', label: 'Name (A-Z)' }
                    ]}
                    onChange={sortMedia}
                />
            </Flex>

            <div style={{ marginTop: '24px' }}>
                {!loading && media.length === 0 ? (
                    <Empty
                        description="No media found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <InfiniteScroll
                        dataLength={media.length}
                        next={getMedia}
                        hasMore={hasMore}
                        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                        endMessage={<Divider plain>No more media to load</Divider>}
                    >
                        <List
                            grid={{
                                // gutter: 16,
                                // xs: 1,
                                // sm: 2,
                                // md: 3,
                                // lg: 4,
                                // xl: 4,
                                // xxl: 5,
                            }}
                            dataSource={media}
                            renderItem={(item) => (
                                <List.Item>
                                    <MediaCard 
                                        key={item.id} 
                                        streamers={streamers} 
                                        {...item} 
                                    />
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                )}
            </div>
        </Space>
    );
};

export default App;
