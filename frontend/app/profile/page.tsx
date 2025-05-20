'use client';

import {
    DollarOutlined,
    EditOutlined,
    EnvironmentOutlined,
    FileOutlined,
    LaptopOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
    SaveOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Skeleton,
    Tabs,
    Typography,
    message
} from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../../components/layout/AppLayout';
import ProjectCard from '../../components/projects/ProjectCard';
import { fetchSellerBids } from '../../lib/redux/slices/bidsSlice';
import { fetchProjects } from '../../lib/redux/slices/projectsSlice';
import { AppDispatch, RootState } from '../../lib/redux/store';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading: userLoading } = useSelector((state: RootState) => state.auth);
  const { projects, loading: projectsLoading } = useSelector((state: RootState) => state.projects);
  const { bids, loading: bidsLoading } = useSelector((state: RootState) => state.bids);

  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'BUYER') {
      dispatch(fetchProjects());
    } else if (user?.role === 'SELLER') {
      dispatch(fetchProjects());
      dispatch(fetchSellerBids());
    }
  }, [dispatch, user?.role]);

  // Reset form fields when user data changes or edit mode is enabled
  useEffect(() => {
    if (user && editMode) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, editMode, form]);

  // Filter projects and bids
  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS');
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');
  const acceptedBids = bids.filter(b => b.status === 'ACCEPTED');

  // Calculate user stats based on role
  const userStats = {
    projectsCompleted: completedProjects.length,
    projectsInProgress: activeProjects.length,
    totalBids: user?.role === 'SELLER' ? bids.length : null,
    totalValue: user?.role === 'BUYER' 
      ? completedProjects.reduce((total, project) => total + ((project.budget.max + project.budget.min) / 2), 0)
      : acceptedBids.reduce((total, bid) => total + bid.amount, 0)
  };

  const handleSaveProfile = (values) => {
    // dispatch(updateUserProfile({ ...values, id: user?.id }));
    setEditMode(false);
    message.success('Profile updated successfully');
  };

  const handlePasswordChange = (values) => {
    // Dispatch action to change password
    message.success('Password changed successfully');
    setShowChangePasswordModal(false);
  };

  // Dummy data for skills and portfolio items (replace with real data)
  const portfolioItems = [
    { id: 1, title: 'E-commerce Website', description: 'Built an e-commerce platform with React and Node.js', image: '/portfolio1.jpg' },
    { id: 2, title: 'Mobile App Design', description: 'Designed UI/UX for a fitness tracking mobile application', image: '/portfolio2.jpg' },
    { id: 3, title: 'Corporate Branding', description: 'Created brand identity for a tech startup', image: '/portfolio3.jpg' },
  ];

  const renderProfileContent = () => {
    if (userLoading) {
      return (
        <Card>
          <Skeleton avatar active paragraph={{ rows: 4 }} />
        </Card>
      );
    }

    if (!user) {
      return (
        <Card>
          <Empty description="User not found" />
        </Card>
      );
    }

    if (editMode) {
      return (
        <Card
          title="Edit Profile"
          extra={
            <Button 
              type="link" 
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveProfile}
            initialValues={{
              name: user.name,
              email: user.email,
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
                
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} />
                </Form.Item>
                
                <Form.Item
                  name="phone"
                  label="Phone Number"
                >
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
                
                <Form.Item
                  name="location"
                  label="Location"
                >
                  <Input prefix={<EnvironmentOutlined />} />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="bio"
                  label="Bio"
                >
                  <TextArea rows={4} placeholder="Tell clients about yourself" />
                </Form.Item>
                
                {user.role === 'SELLER' && (
                  <>
                    <Form.Item
                      name="skills"
                      label="Skills"
                    >
                      <Select mode="tags" placeholder="Add skills" style={{ width: '100%' }}>
                        <Option value="react">React</Option>
                        <Option value="node">Node.js</Option>
                        <Option value="typescript">TypeScript</Option>
                        <Option value="ui-design">UI Design</Option>
                        <Option value="python">Python</Option>
                      </Select>
                    </Form.Item>
                    
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="hourlyRate"
                          label="Hourly Rate ($)"
                        >
                          <Input type="number" prefix={<DollarOutlined />} min={0} />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="availability"
                          label="Availability"
                        >
                          <Select>
                            <Option value="full-time">Full-time</Option>
                            <Option value="part-time">Part-time</Option>
                            <Option value="weekends">Weekends only</Option>
                            <Option value="limited">Limited availability</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
            
            <Form.Item>
              <div className="flex justify-between">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                >
                  Save Profile
                </Button>
                
                <Button
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Change Password
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      );
    }

    return (
      <Card
        extra={
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </Button>
        }
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              src={user.avatar} 
              className="mb-4"
            />
            <Title level={4} className="mb-1 text-center">{user.name}</Title>
            <Text type="secondary" className="mb-4 text-center">
              {user.role === 'BUYER' ? 'Client' : 'Freelancer'}
            </Text>
            
            
            <div className="w-full space-y-2">
              {user.email && (
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-neutral-500" />
                  <Text>{user.email}</Text>
                </div>
              )}
            </div>
            
            {/* <div className="mb-6">
              <Title level={5} className="mb-2">Statistics</Title>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8} md={6}>
                  <Statistic
                    title="Completed"
                    value={userStats.projectsCompleted}
                    prefix={<FileOutlined className="text-success-500" />}
                  />
                </Col>
                
                <Col xs={12} sm={8} md={6}>
                  <Statistic
                    title="In Progress"
                    value={userStats.projectsInProgress}
                    prefix={<ClockCircleOutlined className="text-warning-500" />}
                  />
                </Col>
                
                {user.role === 'seller' && (
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="Total Bids"
                      value={userStats.totalBids}
                      prefix={<TeamOutlined className="text-primary-500" />}
                    />
                  </Col>
                )}
                
                <Col xs={12} sm={8} md={6}>
                  <Statistic
                    title={user.role === 'BUYER' ? "Total Spent" : "Total Earned"}
                    value={userStats.totalValue}
                    prefix={<DollarOutlined className="text-accent-500" />}
                    precision={2}
                  />
                </Col>
              </Row>
            </div> */}
          </div>
        </div>
      </Card>
    );
  };

  const renderTabContent = () => {
    if (projectsLoading || bidsLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </div>
      );
    }

    return (
      <Tabs defaultActiveKey="projects">
        <TabPane 
          tab={
            <span>
              <FileOutlined />
              {user?.role === 'BUYER' ? 'My Projects' : 'Active Projects'}
            </span>
          } 
          key="projects"
        >
          {activeProjects.length > 0 ? (
            <Row gutter={[16, 16]}>
              {activeProjects.map(project => (
                <Col xs={24} md={12} lg={8} key={project.id}>
                  <ProjectCard 
                    project={project} 
                    isBuyer={user?.role === 'BUYER'}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="No active projects" />
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <FileOutlined />
              Completed Projects
            </span>
          } 
          key="completed"
        >
          {completedProjects.length > 0 ? (
            <Row gutter={[16, 16]}>
              {completedProjects.map(project => (
                <Col xs={24} md={12} lg={8} key={project.id}>
                  <ProjectCard 
                    project={project} 
                    isBuyer={user?.role === 'BUYER'}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="No completed projects" />
          )}
        </TabPane>
      </Tabs>
    );
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-8">
        {renderProfileContent()}
        {renderTabContent()}
        
        <Modal
          title="Change Password"
          open={showChangePasswordModal}
          onCancel={() => setShowChangePasswordModal(false)}
          footer={null}
        >
          <Form onFinish={handlePasswordChange} layout="vertical">
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password />
            </Form.Item>
            
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 8, message: 'Password must be at least 8 characters' }
              ]}
            >
              <Input.Password />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            
            <div className="flex justify-end">
              <Button htmlType="submit" type="primary">
                Update Password
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
}