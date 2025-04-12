import React from 'react';
import UsernameSetupCard from '../components/UsernameSetupCard';
import MediaPlayerUrlCard from '../components/MediaPlayerUrlCard';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';

const App: React.FC = () => {
    const description = 'This is a description.';

return (
        <>
        <MediaPlayerUrlCard />
        <UsernameSetupCard/>
            {/* <Steps
                current={0}
                items={[
                {
                    title: 'Start Media Player Setup',
                    description,
                },
                {
                    title: 'In Progress',
                    description,
                    subTitle: 'Left 00:00:08',
                },
                {
                    title: 'S',
                    description,
                },
                ]}
            /> */}
        </>
    );
};

export default App;