import React from 'react';
import UsernameSetupCard from '../components/UsernameSetupCard';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';

const App: React.FC = () => {
    const description = 'This is a description.';

return (
        <>
        <UsernameSetupCard title="Media Player Set Up" content="To use media in your stream add username"/>
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