import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import MediaCard, { Media } from '../components/MediaCard';
import { List, Input, Flex, Select, Divider } from 'antd';

const { Search } = Input;

const App: React.FC = () => {
  const {username} = useParams();
  const [media, setMedia] = useState<Media[] | undefined>();
  const [err, setErr] = useState("");
  const searchMedia = async (search: string) => {
    try {
        const res = await axios.get<[]>(`http://localhost:8080/${username}`, {params: { search: search }});
        setMedia(res.data);
    } catch (err) {
        console.log(err);
    }
  };

  const sortMedia = async (sort: string) => {
    try {
        const response = await axios.get<Media[]>(`http://localhost:8080/${username}`, {params: { sort: sort }});
        setMedia(response.data);
        console.log(response.data);
    } catch (err) {
        console.log(err);
    }
  };
  useEffect(() => {
    axios.get<[]>(`http://localhost:8080/${username}`).then((res) => {
      console.log(res.data);
      setMedia(res.data);
    }).catch((err) => {
      console.log(err.response.data.message);
      setErr(err.response.data.message);
      console.log(media);
    });
  }, []);
  return (<>
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Search  placeholder="search" style={{ width: '30%' }} enterButton onSearch={(e) => (searchMedia(e))} />
          <Select
              showSearch
              style={{ width: '30%' }}
              placeholder="Search to Select"
              optionFilterProp="label"
              defaultValue="um.created_at DESC"
              filterSort={(optionA: { label: string, value: string }, optionB: { label: string, value: string }) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={[
                      {
                          value: 'um.created_at ASC',
                          label: 'Order By Date ASC',
                      },
                      {
                          value: 'um.created_at DESC',
                          label: 'Order By Date DESC',
                      },
                      {
                          value: 'name ASC',
                          label: 'A-Z Order',
                      }
              ]}
              onChange={(e) => sortMedia(e)}
          />
      </Flex>
      <Divider />
      <List
        grid={{
        gutter: 2,
        }}
        dataSource={media}
        renderItem={(item) => (
        <List.Item>
            {/* <Card title={item.title}>Card content</Card> */}
            <MediaCard key={item.id} username={username} {...item}/>
        </List.Item>
        )}
    />
  </>);
};

export default App;
