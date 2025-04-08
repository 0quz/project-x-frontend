import React, { use, useEffect } from 'react';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, message, Space } from 'antd';
import axios from "axios";
import Cookies from 'js-cookie';
import { User } from '../pages/Discover';

interface Media {
    id?: number
    name?: string
    streamers?: User[]
}

const App: React.FC<Media> = (media) => {
    const items: MenuProps['items'] = [
        {
          key: 'my-user',
          label: 'Add to my stream',
          onClick: () => addMediaToMyStream(media.id!, media.name!),
        },
        {
          type: 'divider',
        },
        ...((media.streamers ?? []).map((user) => ({
            key: user.id,
            label: `Add to ${user.username}`,
            onClick: () => addMediaToMyStream(media.id!, media.name!, user.id!),
          })))
    ];

    interface MediaUser {
        mediaId: number;
        mediaName: string;
        userId?: number;
    }

    const addMediaToMyStream = async (id: number, name: string, userId?: number) => {
        const newPost: MediaUser = {
            mediaId: id,
            mediaName: name,
            userId: userId,
          };
        try {
            const res = await axios.post("http://localhost:8080/media/add-media-user", newPost, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
            });
            } catch (error) {
            const errorMessage = (error as any)?.response?.data?.message || "Failed to add media";
            message.error(errorMessage);
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