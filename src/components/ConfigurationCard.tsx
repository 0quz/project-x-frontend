import React from 'react';
import { Card, Button } from 'antd';
import UsernameSetUpModal from './UsernameSetUpModal';

export interface Config {
    title: string;
    content: string;
}

const App: React.FC<Config> = (Config) => {
    return (
        <Card title={ Config.title || "Default size card"} style={{ width: 200, height: 200 }}>
            <p>{Config.content || "Card content"}</p>
            <UsernameSetUpModal/>
        </Card>
    )
};

export default App;