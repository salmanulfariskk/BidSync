'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Spin, theme } from 'antd';
import {
  UserOutlined,
  FileOutlined,
  TeamOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MailOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/redux/store';
import { logout } from '../../lib/redux/slices/authSlice';
import { toggleSidebar } from '../../lib/redux/slices/uiSlice';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { token } = theme.useToken();
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);
  
  const handleLogout = async () => {
    setLoading(true);
    dispatch(logout());
    router.push('/auth/login');
    setLoading(false);
  };

  // Handle sidebar navigation
  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: '/profile',
        icon: <UserOutlined />,
        label: 'Profile',
      },
    ];

    const buyerItems = [
      {
        key: '/projects',
        icon: <FileOutlined />,
        label: 'My Projects',
      },
    ];


    const sellerItems = [
      {
        key: '/projects/browse',
        icon: <FileOutlined />,
        label: 'Browse Projects',
      },
      {
        key: '/bids',
        icon: <TeamOutlined />,
        label: 'My Bids',
      },
    ];

    if (user?.role === 'BUYER') {
      return [...commonItems, ...buyerItems];
    } else {
      return [...commonItems, ...sellerItems];
    }
  };

  // User dropdown menu
  const userMenu :any= {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
      },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        handleLogout();
      } else if (key === 'profile') {
        router.push('/profile');
      } else if (key === 'settings') {
        router.push('/settings');
      }
    },
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={sidebarCollapsed} width={256} className="shadow-md">
        <div className="p-4 h-16 flex items-center justify-center border-b border-neutral-800">
          <h1 className={`text-white text-lg font-bold transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            ProBid
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={getMenuItems()}
          onClick={handleMenuClick}
          className="border-r-0"
        />
      </Sider>
      <Layout>
        <Header className="p-0 bg-white  flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center">
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => dispatch(toggleSidebar())}
              className="w-16 h-16"
            />
            <div className="ml-4 flex items-center">
              <h2 className="text-lg font-medium">
                {pathname === '/dashboard'
                  ? 'Dashboard'
                  : pathname.startsWith('/projects/create')
                  ? 'Create Project'
                  : pathname.startsWith('/projects/browse')
                  ? 'Browse Projects'
                  : pathname.startsWith('/projects/')
                  ? 'Project Details'
                  : pathname.startsWith('/projects')
                  ? 'My Projects'
                  : pathname.startsWith('/bids')
                  ? 'My Bids'
                  : pathname.startsWith('/profile')
                  ? 'My Profile'
                  : 'Dashboard'}
              </h2>
            </div>
          </div>
          <div className="flex items-center pr-6">
            <Badge count={3} className="mr-4">
              <Button icon={<BellOutlined />} shape="circle" />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="cursor-pointer flex items-center">
                <Avatar icon={<UserOutlined />} className="bg-primary-600" />
                <span className="ml-2 text-sm font-medium hidden sm:inline">{user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm min-h-[280px]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}