import React from 'react';
import { TrophyOutlined, SettingOutlined, CreditCardOutlined, VideoCameraAddOutlined, ThunderboltOutlined, UnorderedListOutlined, MediumSquareFilled, EditOutlined, HomeOutlined, DashboardOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, MenuProps, Divider } from 'antd';
import { useState, useEffect } from 'react';
import Discover from './Discover';
import StreamerConfiguration from './StreamerConfiguration';
import CreateMedia from './CreateMedia';
import MyMedia from './MyMedias'
import Credits from './Credits';
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/public/vite.svg";
import UserSettings from '../components/UserSettings'

const { Header, Content, Sider } = Layout;

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

const App: React.FC = () => {
    const [menu, setMenu] = useState<MenuProps['items'] | null>(null);
    const [path, setPath] = useState(location.pathname);
    const [currentComponent, setCurrentComponent] = useState(<Discover/>)
    const navigate = useNavigate();

    useEffect(() => {
        const route = () => {
            if (path === "/discover") setCurrentComponent(<Discover/>);
            else if (path === "/configurations") setCurrentComponent(<StreamerConfiguration/>);
            else if (path === "/create-media") setCurrentComponent(<CreateMedia/>);
            else if (path === "/credits") setCurrentComponent(<Credits/>);
            else if (path === "/configurations/my-media") setCurrentComponent(<MyMedia/>);
            else setCurrentComponent(<>{path}</>);
        }
        route();
        }, [path]);

    const updatePath = (path: string) => {
        console.log(path)
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
            key: '/configurations',
            label: 'Dashboard',
            icon: React.createElement(DashboardOutlined),
            onClick: () => (setMenu(items3), updatePath('/configurations')),
        },
        {
            key: '/create-media',
            label: 'Create a Media',
            icon: React.createElement(VideoCameraAddOutlined),
            onClick: () => (setMenu(items4), updatePath('/create-media')),
        },
        {
            key: '/credits',
            label: 'Credits',
            icon: React.createElement(CreditCardOutlined),
            onClick: () => (setMenu(items5), updatePath('/credits')),
        }
    ]

    const items2: MenuProps['items'] = [
        {
            key: '/side-discover',
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
            key: '/my-media',
            label: 'My Media',
            icon: React.createElement(MediumSquareFilled),
            onClick: () => updatePath('/configurations/my-media')
        },
        {
            key: '/my-editors',
            label: 'My Editors',
            icon: React.createElement(EditOutlined),
            onClick: () => updatePath('/my-editors')
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

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const headerStyle: React.CSSProperties = {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    }

    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '50vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 60,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
        background: colorBgContainer
      };

    return (
        <Layout>
            <Header style={headerStyle}>
            <img src={logo} alt="Company Logo" className="logo" />
            <ThunderboltOutlined />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[path]}
                items={items1}
                style={{ flex: 1, minWidth: 0 }}
            />
            <UserSettings/>
            </Header>
            <Layout>
            <Sider breakpoint="md" width={200} style={siderStyle}>
                <Menu
                mode="inline"
                defaultSelectedKeys={['side-' + path]}
                style={{ height: '100%', borderRight: 0 }}
                items={menu || items2}
                />
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                {/* <Breadcrumb
                items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                style={{ margin: '16px 0' }}
                /> */}
                <Divider/>
                <Content
                id="content"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    display: "flex", // Makes the content align horizontally
                    flexWrap: "wrap" // Ensures items wrap to a new row
                    //gap: "20px", // Adds space between cards
                    //justifyContent: "left", // Centers them horizontally
                }}
                >
                    {currentComponent}
                </Content>
            </Layout>
            </Layout>
        </Layout>
    );
};

export default App;