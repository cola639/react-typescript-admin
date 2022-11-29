import React, {useState} from 'react'

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons'
import {Layout, Menu} from 'antd'
import './index.css'

const {Header, Sider, Content} = Layout

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false)

    const menuItems = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: 'nav 1',
        },
        {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'nav 2',
        },
        {
            key: '3',
            icon: <UploadOutlined />,
            label: 'nav 3',
        },
    ]

    return (
        <Layout className="wrap">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
            </Sider>
            <Layout className="site-layout">
                <Header style={{padding: 0}}>
                    <div className="toggle" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}>
                    Content
                </Content>
            </Layout>
        </Layout>
    )
}

export default App
