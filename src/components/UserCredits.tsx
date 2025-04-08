import React, { useEffect } from 'react';
import { Typography, Tooltip, theme } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Text } = Typography;

const UserCredits: React.FC = () => {
    const [credits, setCredits] = React.useState("0");
    const { token } = theme.useToken();

    useEffect(() => {
        axios.get<{ credits: string }>('http://localhost:8080/wallet', {
            headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}
        }).then((res) => {
            setCredits(res.data.credits);
        })
    }, []);

    return (
        <Tooltip title="Available Credits">
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '0 16px',
                cursor: 'default'
            }}>
                <CreditCardOutlined style={{ color: token.colorPrimary }} />
                <Text>
                    {credits} Credits
                </Text>
            </div>
        </Tooltip>
    );
};

export default UserCredits;
