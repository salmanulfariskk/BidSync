'use client';

import {
  CheckCircleOutlined,
  ClockCircleOutlined, DollarOutlined,
  EditOutlined,
  FileOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions, Divider, Empty,
  Modal,
  Row,
  Spin,
  Tabs,
  Tag,
  Typography, notification
} from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../../../components/layout/AppLayout';
import BidCard from '../../../components/projects/BidCard';
import { fetchProjectBids } from '../../../lib/redux/slices/bidsSlice';
import { completeProject, fetchProjectById, fetchProjects, Project } from '../../../lib/redux/slices/projectsSlice';
import { AppDispatch, RootState } from '../../../lib/redux/store';
import axios from '../../../lib/axios';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;


export default function ProjectDetailsPage() {
  const { id } = useParams();
  console.log("Project ID:", id);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectBids, setProjectBids] = useState<any[]>([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/projects/${id}`);
      console.log("response==>", response.data);
      setProject(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }
  
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchProjectBids = async () => {
    try {
      setBidsLoading(true);
      const response = await axios.get(`/projects/${id}/bids`);
      setProjectBids(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    } finally {
      setBidsLoading(false);
    }
  }

  
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  
  const projectId = Array.isArray(id) ? id[0] : id;
  const isBuyer = user?.id === project?.buyerId;
  const isSeller = user?.id === project?.sellerId;
  
  useEffect(() => {
    fetchProject();
    fetchProjectBids();
  }, [projectId]);
  
  const handleEditProject = () => {
    router.push(`/projects/${projectId}/edit`);
  };
  
  const handleBidOnProject = () => {
    router.push(`/projects/${projectId}/bid`);
  };
  
  const handleSelectBid = async (bid: any) => {
    try {
      await axios.post(`/projects/${projectId}/select-bid`, {
        bidId: bid.id,
        sellerId: bid.sellerId
      });
      notification.success({
        message: 'Bid Selected',
        description: `You have selected ${bid.seller?.name}'s bid. They have been notified.`,
      });
      fetchProjectBids();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to select the bid. Please try again.',
      });
    }
  };
  
  const handleMarkComplete = async () => {
    setMarkingComplete(true);
    try {
      await axios.post(`/projects/${projectId}/complete`);
      notification.success({
        message: 'Project Completed',
        description: 'The project has been marked as completed.',
      });
      fetchProject();
      setCompleteModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to complete the project. Please try again.',
      });
    } finally {
      setMarkingComplete(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="warning" className="text-base px-3 py-1">Pending</Tag>;
      case 'in_progress':
        return <Tag color="processing" className="text-base px-3 py-1">In Progress</Tag>;
      case 'completed':
        return <Tag color="success" className="text-base px-3 py-1">Completed</Tag>;
      default:
        return <Tag color="default" className="text-base px-3 py-1">{status}</Tag>;
    }
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }
  
  if (!project) {
    return (
      <AppLayout>
        <Empty
          description="Project not found"
          className="my-12"
        >
          <Button type="primary" onClick={() => router.push('/projects')}>
            Back to Projects
          </Button>
        </Empty>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <Title level={3} className="mb-2">{project?.title}</Title>
              <div className="flex flex-wrap gap-2 items-center">
                {getStatusBadge(project?.status || 'PENDING')}
                <div className="text-sm text-neutral-500">
                  Posted {formatDistanceToNow(new Date(project?.createdAt || ''), { addSuffix: true })}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {isBuyer && project?.status === 'PENDING' && (
                <Button
                  icon={<EditOutlined />}
                  onClick={handleEditProject}
                >
                  Edit Project
                </Button>
              )}
              
              {!isBuyer && project?.status === 'PENDING' && (
                <Button
                  type="primary"
                  onClick={handleBidOnProject}
                >
                  Place Bid
                </Button>
              )}
              
              {isBuyer && project?.status === 'IN_PROGRESS' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => setCompleteModalVisible(true)}
                >
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>
          
          <Divider className="my-4" />
          
          <Descriptions layout="vertical" column={{ xs: 1, sm: 2, md: 4 }} className="mb-6">
            <Descriptions.Item 
              label="Budget" 
              labelStyle={{ fontWeight: 500 }}
            >
              <div className="flex items-center">
                <DollarOutlined className="mr-1 text-success-500" />
                ${project?.budget.min} - ${project?.budget.max}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label="Deadline"
              labelStyle={{ fontWeight: 500 }}
            >
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-1 text-warning-500" />
                {new Date(project?.deadline || '').toLocaleDateString()}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label="Client"
              labelStyle={{ fontWeight: 500 }}
            >
              <div className="flex items-center">
                <UserOutlined className="mr-1 text-primary-500" />
                {project?.buyer?.name || 'Anonymous'}
              </div>
            </Descriptions.Item>
            
            {project?.status !== 'PENDING' && (
              <Descriptions.Item 
                label="Seller"
                labelStyle={{ fontWeight: 500 }}
              >
                <div className="flex items-center">
                  <UserOutlined className="mr-1 text-accent-500" />
                  {project?.seller?.name || 'Not Assigned'}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
          
          <Divider orientation="left">Description</Divider>
          
          <Paragraph className="whitespace-pre-line">
            {project?.description}
          </Paragraph>
          
          {project?.files && project?.files.length > 0 && (
            <>
              <Divider orientation="left">Attachments</Divider>
              <div className="flex flex-wrap gap-2">
                {project?.files.map((file) => (
                  <Button
                    key={file.id}
                    icon={<FileOutlined />}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </Button>
                ))}
              </div>
            </>
          )}
        </Card>
        
        <Tabs defaultActiveKey="bids" className="mb-6">
          <TabPane tab={`Bids (${projectBids.length})`} key="bids">
            {bidsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spin />
              </div>
            ) : projectBids.length === 0 ? (
              <Empty
                description="No bids yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="py-12"
              />
            ) : (
              <Row gutter={[16, 16]}>
                {projectBids.map((bid) => (
                  <Col key={bid.id} xs={24} md={12} lg={8}>
                    <BidCard
                      bid={bid}
                      isBuyer={isBuyer}
                      isSelected={project?.sellerId === bid.sellerId}
                      onSelectBid={handleSelectBid}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
          
          {(project?.status === 'IN_PROGRESS' || project?.status === 'COMPLETED') && (
            <TabPane tab="Deliverables" key="deliverables">
              {project?.status === 'COMPLETED' ? (
                <div className="p-4 border border-success-200 bg-success-50 rounded-md">
                  <div className="flex items-center">
                    <CheckCircleOutlined className="text-success-500 text-xl mr-2" />
                    <Text strong className="text-success-700">
                      This project has been completed
                    </Text>
                  </div>
                </div>
              ) : isSeller ? (
                <Card>
                  <div className="flex flex-col items-center p-4">
                    <Title level={4}>Upload Project Deliverables</Title>
                    <Paragraph className="text-center mb-6">
                      Upload the completed work for the client to review
                    </Paragraph>
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      size="large"
                    >
                      Upload Files
                    </Button>
                  </div>
                </Card>
              ) : (
                <Empty
                  description="No deliverables uploaded yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="py-12"
                />
              )}
            </TabPane>
          )}
        </Tabs>
      </div>
      
      <Modal
        title="Complete Project"
        open={completeModalVisible}
        onCancel={() => setCompleteModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setCompleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={markingComplete}
            onClick={handleMarkComplete}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>Are you sure you want to mark this project as complete?</p>
        <p>This action cannot be undone and will release payment to the seller.</p>
      </Modal>
    </AppLayout>
  );
}