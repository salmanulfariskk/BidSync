'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Statistic, Button, List, Typography, Skeleton, Empty } from 'antd';
import { PlusOutlined, FileOutlined, TeamOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../lib/redux/slices/projectsSlice';
import { fetchSellerBids } from '../../lib/redux/slices/bidsSlice';
import { RootState, AppDispatch } from '../../lib/redux/store';
import AppLayout from '../../components/layout/AppLayout';
import ProjectCard from '../../components/projects/ProjectCard';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects, loading: projectsLoading } = useSelector((state: RootState) => state.projects);
  const { bids, loading: bidsLoading } = useSelector((state: RootState) => state.bids);

  
  useEffect(() => {
    if (user?.role === 'BUYER') {
      dispatch(fetchProjects());
    } else if (user?.role === 'SELLER') {
      dispatch(fetchProjects());
      dispatch(fetchSellerBids());
    }
  }, [dispatch, user?.role]);
  
  // Filter projects based on user role and status
  const pendingProjects = projects.filter(p => p.status === 'PENDING');
  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS');
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');
  
  const userProjects = user?.role === 'BUYER'
    ? projects
    : projects.filter(p => p.sellerId === user?.id);
  
  const activeBids = bids.filter(b => b.status === 'PENDING');
  const acceptedBids = bids.filter(b => b.status === 'ACCEPTED');
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Stats Section */}
        <Row gutter={[16, 16]} className="mb-8">
          {user?.role === 'BUYER' ? (
            <>
              <Col xs={12} sm={8} md={6}>
                <Card className="h-full">
                  <Statistic
                    title="Posted Projects"
                    value={projects.length}
                    prefix={<FileOutlined className="mr-1 text-primary-500" />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card className="h-full">
                  <Statistic
                    title="Active Projects"
                    value={activeProjects.length}
                    prefix={<ClockCircleOutlined className="mr-1 text-warning-500" />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card className="h-full">
                  <Statistic
                    title="Completed Projects"
                    value={completedProjects.length}
                    prefix={<FileOutlined className="mr-1 text-success-500" />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card className="h-full">
                  <Statistic
                    title="Total Spent"
                    value={projects.reduce((total, project) => {
                      // If project is completed and has a bid amount, add to total
                      if (project.status === 'COMPLETED') {
                        return total + (project.budget.max + project.budget.min) / 2;
                      }
                      return total;
                    }, 0)}
                    prefix={<DollarOutlined className="mr-1 text-accent-500" />}
                    precision={2}
                  />
                </Card>
              </Col>
            </>
          ) : (
            <>
              <Col xs={12} sm={8} md={6}>
                <Card className="h-full">
                  <Statistic
                    title="Active Bids"
                    value={activeBids.length}
                    prefix={<TeamOutlined className="mr-1 text-primary-500" />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card className="h-full">
                  <Statistic
                    title="Projects Working On"
                    value={activeProjects.length}
                    prefix={<ClockCircleOutlined className="mr-1 text-warning-500" />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card className="h-full">
                  <Statistic
                    title="Completed Projects"
                    value={completedProjects.length}
                    prefix={<FileOutlined className="mr-1 text-success-500" />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card className="h-full">
                  <Statistic
                    title="Total Earned"
                    value={acceptedBids.reduce((total, bid) => {
                      return total + bid.amount;
                    }, 0)}
                    prefix={<DollarOutlined className="mr-1 text-accent-500" />}
                    precision={2}
                  />
                </Card>
              </Col>
            </>
          )}
        </Row>
        
        {/* Quick Actions */}
        <Card className="mb-8">
          <div className="flex flex-wrap gap-4">
            {user?.role === 'BUYER' ? (
              <>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => router.push('/projects/create')}
                >
                  Post New Project
                </Button>
                <Button
                  onClick={() => router.push('/projects')}
                >
                  View My Projects
                </Button>
              </>
            ) : (
              <>
                <Button 
                  type="primary" 
                  onClick={() => router.push('/projects/browse')}
                >
                  Find Projects
                </Button>
                <Button
                  onClick={() => router.push('/bids')}
                >
                  View My Bids
                </Button>
              </>
            )}
          </div>
        </Card>
        
        {/* Recent Activity */}
        <div className="mb-8">
          <Title level={4} className="mb-4">
            {user?.role === 'BUYER' ? 'Recent Projects' : 'Recent Activity'}
          </Title>
          
          {(projectsLoading || bidsLoading) ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Card>
              ))}
            </div>
          ) : user?.role === 'BUYER' ? (
            projects.length > 0 ? (
              <Row gutter={[16, 16]}>
                {projects.slice(0, 3).map(project => (
                  <Col xs={24} md={12} lg={8} key={project.id}>
                    <ProjectCard 
                      project={project} 
                      isBuyer={true}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description="You haven't posted any projects yet"
                className="my-8"
              >
                <Button
                  type="primary"
                  onClick={() => router.push('/projects/create')}
                  icon={<PlusOutlined />}
                >
                  Post Your First Project
                </Button>
              </Empty>
            )
          ) : (
            <List
              dataSource={[...activeBids, ...acceptedBids].slice(0, 5)}
              renderItem={bid => (
                <List.Item>
                  <Card className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <Text strong>{bid.projectId}</Text>
                        <div className="flex items-center gap-2 mt-1">
                          <Text className="text-neutral-500">
                            ${bid.amount}
                          </Text>
                          <Text className="text-neutral-500">
                            • {bid.deliveryTime} days
                          </Text>
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={() => router.push(`/projects/${bid.projectId}`)}
                        >
                          View Project
                        </Button>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
              locale={{
                emptyText: (
                  <Empty
                    description="You haven't placed any bids yet"
                    className="my-8"
                  >
                    <Button
                      type="primary"
                      onClick={() => router.push('/projects/browse')}
                    >
                      Browse Available Projects
                    </Button>
                  </Empty>
                ),
              }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}