import axios from "axios";
import { useState, useEffect } from 'react';
import { Input } from 'antd';
import MediaCard, { Media } from '../components/MediaCard';

const { Search } = Input;

const App: React.FC = () => {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchMedia = async () => {
        try {
            const response = await axios.get<Media[]>("http://localhost:8080/media");
            setMedia(response.data);
        } catch (err) {
            setError("Failed to fetch posts");
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchMedia();
    }, []); // Empty dependency array ensures it runs once when the component mounts


const searchMedia = async (search: string) => {
    try {
        const response = await axios.get<Media[]>("http://localhost:8080/media", {params: { search: search }});
        setMedia(response.data);
    } catch (err) {
        console.log(err);
    }
};

return (
        <>
            <Search placeholder="input search loading with enterButton" enterButton onSearch={(e) => (searchMedia(e))} />
            {media.map((media) =>
                <MediaCard key={media.id} id={media.id}
                name={media.name} url={media.url} 
                created_by_name={media.created_by_name} 
                description={media.description} audio_url={media.audio_url} />
            )}
        </>
    );
};

export default App;