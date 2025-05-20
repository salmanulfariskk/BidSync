'use client';

import { Card, Tag, Avatar, Button, Tooltip, Typography, Divider, Badge, Space } from 'antd';
import { ClockCircleOutlined, DollarOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Project } from '../../lib/redux/slices/projectsSlice';

const { Title, Text, Paragraph } = Typography;

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  isBuyer?: boolean;
}

export default function ProjectCard({ project, showActions = true, isBuyer = false }: ProjectCardProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge status="warning" text="Pending" className="status-pending px-2 py-1 rounded-full" />;
      case 'in_progress':
        return <Badge status="processing" text="In Progress" className="status-inprogress px-2 py-1 rounded-full" />;
      case 'completed':
        return <Badge status="success" text="Completed" className="status-completed px-2 py-1 rounded-full" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const handleViewDetails = () => {
    router.push(`/projects/${project.id}`);
  };

  const handlePlaceBid = () => {
    router.push(`/projects/${project.id}/bid`);
  };

  return (
    <Card 
      hoverable 
      className="card animate-fade-in transition-all duration-300 hover:translate-y-[-4px] h-full"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Title level={4} className="mb-1 text-lg">{project.title}  - <span className="text-sm text-neutral-500">(${project.budget.min} - ${project.budget.max})</span></Title>

              {project.bidCount !== undefined && (
                <Tag icon={<TeamOutlined />} color="blue">
                  {project.bidCount} {project.bidCount === 1 ? 'Bid' : 'Bids'}
                </Tag>
              )}
          </div>
          <div>
            <Tag color={project.status === 'COMPLETED' ? 'green' : project.status === 'IN_PROGRESS' ? 'blue' : 'default'} icon={<DollarOutlined />} className="text-base">
              {getStatusBadge(project.status)}
            </Tag>
          </div>
        </div>

        <Paragraph 
          ellipsis={{ rows: 3, expandable: false }}
          className="text-neutral-700 mb-4"
        >
          {project.description}
        </Paragraph>

        <div className="mt-auto">
          <Divider className="my-3" />
          
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center">
              <Avatar icon={<UserOutlined />} className="bg-primary-500" />
              <div className="ml-2">
                <Text className="block text-sm">{project.buyer?.name || 'Anonymous'}</Text>
                <Text type="secondary" className="text-xs">
                  Posted {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </Text>
              </div>
            </div>
            
            <div className="flex items-center mt-2 sm:mt-0">
              <Tooltip title="Deadline">
                <ClockCircleOutlined className="mr-1 text-neutral-500" />
                <Text type="secondary">
                  {new Date(project.deadline).toLocaleDateString()}
                </Text>
              </Tooltip>
            </div>
          </div>
          
          {showActions && (
            <div className="mt-4 flex justify-end">
              <Button 
                type="primary" 
                onClick={handleViewDetails}
                className="mr-2"
              >
                View Details
              </Button>
              
              {!isBuyer && project.status === 'PENDING' && (
                <Button 
                  type="default" 
                  onClick={handlePlaceBid}
                >
                  Place Bid
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}