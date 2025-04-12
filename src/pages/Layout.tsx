import React from 'react';
import { TrophyOutlined, LoginOutlined, SettingOutlined, CreditCardOutlined, UserOutlined, VideoCameraAddOutlined, ThunderboltOutlined, UnorderedListOutlined, MediumSquareFilled, EditOutlined, HomeOutlined, DashboardOutlined } from '@ant-design/icons';
import { Layout, Menu, ConfigProvider, theme as antTheme, MenuProps, Divider, Button, Modal, Typography } from 'antd';
import { useState, useEffect } from 'react';
import Discover from './Discover';
import Configurations from './Configurations';
import MyMedia from './MyMedias'
import MyStream from './MyStream';
import Credits from './Credits';
import { useNavigate } from "react-router-dom";
//import logo from "/public/vite.svg";
import UserSettings from '../components/UserSettings'
import MyEditors from './MyEditors';
import MediaTrimmer from './MediaTrimmer';
import CustomerDashboard from '../pages/CustomerDashboard';
import {useParams} from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import GoogleAuth from '../components/GoogleAuth';
import MyStreamers from './MyStreamers';
import EditorsDashboard from './EditorsDashboard';
import UserCredits from '../components/UserCredits';
import ThemeToggle from '../components/ThemeToggle';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface User {
    avatar: string;
    username: string;
    credits: number;
}

const App: React.FC = () => {
    const { username } = useParams();
    const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
    const [menu, setMenu] = useState<MenuProps['items'] | null>(null);
    const [path, setPath] = useState(location.pathname);
    const [currentComponent, setCurrentComponent] = useState(<Discover/>);
    const [user, setUser] = useState<User | null>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });
    const navigate = useNavigate();

    // Use Ant Design's algorithm tokens
    const { defaultAlgorithm, darkAlgorithm } = antTheme;

    // Theme toggle handler
    const toggleTheme = () => {
        setIsDarkMode((prev: boolean) => {
            const newValue = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newValue));
            return newValue;
        });
    };

    const getUser = async () => {
        setToken(Cookies.get("token"));
        if (Cookies.get("token")) {
            axios.get<User>('http://localhost:8080/users/profile', {
                headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }).then((res) => {
                setUser(res.data);
                if (!res.data.username) {
                    navigate("/user-setup");
                }
            })
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        const route = () => {
            console.log(path);
            if (path === "/discover") {
                setCurrentComponent(<Discover/>)
                setMenu(items2)
            }
            else if (path === "/configurations") {
                setCurrentComponent(<Configurations/>)
                setMenu(items3)
            }
            else if (path === "/create-media") {
                setCurrentComponent(<MediaTrimmer/>)
                setMenu(items4)
            }
            else if (path === "/credits") {
                setCurrentComponent(<Credits/>)
                setMenu(items5)
            }
            else if (path === "/dashboard/my-stream") {
                setCurrentComponent(<MyStream/>)
                setMenu(items3)
            }
            else if (path === "/dashboard/my-editors") {
                setCurrentComponent(<MyEditors/>)
                setMenu(items3)
            }
            else if (path === "/dashboard/my-streamers") {
                setCurrentComponent(<MyStreamers/>)
                setMenu(items3)
            }
            else if (path === "/dashboard/my-media") {
                setCurrentComponent(<MyMedia/>)
                setMenu(items3)
            }
            else if (path === `/editor/streamer/${username}`) {
                setCurrentComponent(<EditorsDashboard/>)
                setMenu(items7)
            }
            else if (path === `/${username}`) {
                setCurrentComponent(<CustomerDashboard/>)
                setMenu(items6)
            } else {
                setCurrentComponent(<Discover/>)
                setMenu(items2)
            }
        }
        route();
    }, [path, username]);

    const updatePath = (path: string) => {
        navigate(path, { replace: false }); // Change URL without refresh
        setPath(path)
      };

    const items1: MenuProps['items'] = [
        {
            key: '/discover',
            label: 'Home',
            icon: React.createElement(HomeOutlined),
            onClick: () => (setMenu(items2), updatePath('/discover')),
        },
        {
            key: '/create-media',
            label: 'Create a Media',
            icon: React.createElement(VideoCameraAddOutlined),
            onClick: () => (setMenu(items4), updatePath('/create-media')),
        },
    ]

    if (token){
        items1.push(
            {
                key: '/credits',
                label: 'Buy Credits',
                icon: React.createElement(CreditCardOutlined),
                onClick: () => (setMenu(items5), updatePath('/credits')),
            },
            {
                key: '/configurations',
                label: 'Dashboard',
                icon: React.createElement(DashboardOutlined),
                onClick: () => (setMenu(items3), updatePath('/configurations')),
            }
        )
    }

    const items2: MenuProps['items'] = [
        {
            key: '/discover',
            label: 'Discover',
            icon: React.createElement(UnorderedListOutlined),
            onClick: () => updatePath('/discover')
        },
        {
            key: '/top-streamers',
            label: 'Top Streamers',
            icon: React.createElement(TrophyOutlined),
            onClick: () => updatePath('/top-streamers')
        },
    ];

    const items3: MenuProps['items'] = [
        {
            key: '/configurations',
            label: 'Configurations',
            icon: React.createElement(SettingOutlined),
            onClick: () => updatePath('/configurations')
        },
        {
            key: '/dashboard/my-stream',
            label: 'My Stream',
            icon: React.createElement(MediumSquareFilled),
            onClick: () => updatePath('/dashboard/my-stream')
        },
        {
            key: '/dashboard/my-editors',
            label: 'My Editors',
            icon: React.createElement(EditOutlined),
            onClick: () => updatePath('/dashboard/my-editors')
        },
        {
            key: '/dashboard/my-streamers',
            label: 'My Streamers',
            icon: React.createElement(UserOutlined),
            onClick: () => updatePath('/dashboard/my-streamers')
        },
        {
            key: '/dashboard/my-media',
            label: 'My Media',
            icon: React.createElement(MediumSquareFilled),
            onClick: () => updatePath('/dashboard/my-media')
        },
    ];

    const items4: MenuProps['items'] = [
        {
            key: '/create-media',
            label: 'Create a Media',
            icon: React.createElement(VideoCameraAddOutlined),
            onClick: () => updatePath('/create-media')
        }
    ];

    const items5: MenuProps['items'] = [
        {
            key: '/credits',
            label: 'Buy Credits',
            icon: React.createElement(CreditCardOutlined),
            onClick: () => updatePath('/credits')
        }
    ];

    const items6: MenuProps['items'] = [
        {
            key: `/${username}`,
            label: `${username}'s Media`,
            icon: React.createElement(CreditCardOutlined),
            onClick: () => updatePath(`/${username}`)
        }
    ];

    const items7: MenuProps['items'] = [
        {
            key: `/editor/streamer/${username}`,
            label: `${username}'s Media`,
            icon: React.createElement(CreditCardOutlined),
            onClick: () => updatePath(`/editor/streamer/${username}`)
        }
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = antTheme.useToken();

    const headerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        //background: isDarkMode ? '#141414' : colorBgContainer,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '64px'
    };

    const logoStyle: React.CSSProperties = {
        height: '32px',
        margin: '0 24px 0 0',
        verticalAlign: 'middle'
    };

    const siderStyle: React.CSSProperties = {
        //background: isDarkMode ? '#141414' : colorBgContainer,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'auto',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        paddingTop: '20px'
    };

    const contentStyle: React.CSSProperties = {
        marginLeft: collapsed ? 80 : 200, // Changed from 0 to 80
        //marginLeft: 200,
        marginTop: 64,
        padding: '24px',
        minHeight: 'calc(100vh - 64px)',
        //background: isDarkMode ? '#141414' : '#f0f2f5', // Updated this line
        borderRadius: borderRadiusLG,
        transition: 'all 0.2s',
    };

    const userActionsStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginLeft: 'auto',
        height: '64px',
        padding: '0 8px'
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
                components: {
                    Layout: {
                        bodyBg: isDarkMode ? '#141414' : '#f0f2f5',
                        siderBg: isDarkMode ? '#141414' : colorBgContainer,
                        headerBg: isDarkMode ? '#141414' : colorBgContainer,
                    },
                    Menu: {
                        // Add dark mode styles for menu
                        darkItemBg: '#141414',
                        darkItemColor: 'rgba(255, 255, 255, 0.85)',
                        darkItemHoverBg: '#1f1f1f',
                        darkItemSelectedBg: '#1f1f1f',
                    }
                },
                token: {
                    colorBgLayout: isDarkMode ? '#141414' : '#f0f2f5',
                }
            }}
        >
            <Layout style={{ 
                //minHeight: '100vh',
                //background: isDarkMode ? '#141414' : '#f0f2f5' 
            }}>
                <Header style={headerStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <img src={logo} alt="Company Logo" style={logoStyle} /> */}
                        <ThunderboltOutlined style={{ 
                            fontSize: '24px', 
                            marginRight: '24px',
                            color: isDarkMode ? '#fff' : undefined 
                        }} />
                    </div>
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={[path]}
                        items={items1}
                        style={{ 
                            flex: 1, 
                            border: 'none',
                            minWidth: 0,
                            //background: isDarkMode ? '#141414' : colorBgContainer
                        }}
                        theme={isDarkMode ? 'dark' : 'light'}
                    />
                    <div style={userActionsStyle}>
                        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
                        {token ? (
                            <>
                                <UserCredits />
                                <Divider 
                                    type="vertical" 
                                    style={{ 
                                        height: '24px', 
                                        margin: '0',
                                        //borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : undefined
                                    }} 
                                />
                                <UserSettings onDone={getUser} {...user} />
                            </>
                        ) : (
                            <Button 
                                type="primary"
                                icon={<LoginOutlined />}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Sign In
                            </Button>
                        )}
                    </div>
                </Header>

                <Layout> {/*style={{ background: isDarkMode ? '#141414' : '#f0f2f5' }} */}
                    <Sider 
                        style={siderStyle}
                        width={200}
                        collapsible
                        collapsed={collapsed}
                        breakpoint="md"
                        //collapsedWidth={80}  // Changed from 0 to 80
                        onBreakpoint={(broken) => {
                            setCollapsed(broken);
                        }}
                        trigger={null} // Remove the default trigger
                        theme={isDarkMode ? 'dark' : 'light'}
                    >
                        <Menu
                            mode="inline"
                            selectedKeys={[path]}
                            items={menu || items2}
                            style={{ 
                                border: 'none',
                                padding: '8px',
                                //background: isDarkMode ? '#141414' : colorBgContainer
                            }}
                            //inlineCollapsed={collapsed} // Add this prop
                            theme={isDarkMode ? 'dark' : 'light'}
                        />
                    </Sider>

                    <Layout style={{ 
                        //background: isDarkMode ? '#141414' : '#f0f2f5',
                        ...contentStyle 
                    }}>
                        <Content>
                            {currentComponent}
                        </Content>
                    </Layout>
                </Layout>

                <Modal 
                    title={<Title level={4}>Sign In</Title>}
                    open={isModalOpen} 
                    onCancel={() => setIsModalOpen(false)} 
                    footer={null}
                    centered
                    width={400}
                >
                    <GoogleAuth onDone={getUser}/>
                </Modal>
            </Layout>
        </ConfigProvider>
    );
};

export default App;
