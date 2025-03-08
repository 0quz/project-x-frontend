import React from 'react';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import axios from "axios";

interface Media {
    id?: number
}

const App: React.FC<Media> = (Media) => {
    const items: MenuProps['items'] = [
        {
          key: '1',
          label: 'Add for my stream',
          onClick: () => addMediaToMyStream(Media.id!),
        },
        {
          type: 'divider',
        },
        {
          key: '2',
          label: 'Profile',
        //   extra: '⌘P',
        },
        {
          key: '3',
          label: 'Billing',
        //   extra: '⌘B',
        },
        {
          key: '4',
          label: 'Settings',
        //   icon: <SettingOutlined />,
        //   extra: '⌘S',
        }
    ];

    interface MediaUser {
        media_id: number;
        email?: string;
    }

    const addMediaToMyStream = async (id: number) => {
        const newPost: MediaUser = {
            media_id: id,
            // email: "oguz.28414@gmail.com"
          };
        try {
            const response = await axios.post("http://localhost:8080/media/add-media-user", newPost);
            console.log(response.data)
            } catch (error) {
            console.error("Error creating post:", error);
        }
    }
    return (
        <Dropdown menu={{items}}>
            <Space>
                <PlusOutlined />
            </Space>
        </Dropdown>
    );
}

export default App;