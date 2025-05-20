'use client';

import { Card, Avatar, Typography, Tag, Button, Space, Divider, Rate, Tooltip } from 'antd';
import { DollarOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { Bid } from '../../lib/redux/slices/bidsSlice';

const { Title, Text, Paragraph } = Typography;

interface BidCardProps {
  bid: Bid;
  isBuyer?: boolean;
  isSelected?: boolean;
  onSelectBid?: (bid: Bid) => void;
}

export default function BidCard({ bid, isBuyer = false, isSelected = false, onSelectBid }: BidCardProps) {
  
  const handleSelectBid = () => {
    if (onSelectBid) {
      onSelectBid(bid);
    }
  };

  return (
    <Card 
      hoverable 
      className={`card animate-fade-in ${isSelected ? 'border-primary-500 border-2' : ''}`}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Avatar size={40} icon={<UserOutlined />} className="bg-primary-500" />
            <div className="ml-3">
              <Title level={5} className="mb-0">{bid.seller?.name || 'Anonymous Seller'}</Title>
              <Rate disabled defaultValue={4.5} className="text-xs" />
            </div>
          </div>
          
          {isSelected && (
            <Tag color="success" className="text-sm">
              Selected Bid
            </Tag>
          )}
        </div>
        
        <Space className="mb-4">
          <Tag color="green" icon={<DollarOutlined />} className="text-base px-3 py-1">
            ${bid.amount}
          </Tag>
          <Tag color="blue" icon={<CalendarOutlined />} className="text-base px-3 py-1">
            {bid.deliveryTime} days
          </Tag>
        </Space>
        
        <Paragraph 
          className="text-neutral-700  mb-4"
        >
          {bid.message}
        </Paragraph>
        
        <div className="mt-auto">
          <Divider className="my-3" />
          
          <div className="flex justify-between items-center">
            <Text type="secondary" className="text-sm">
              Bid placed {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
            </Text>
            
            {isBuyer && bid.status === 'PENDING' && !isSelected && (
              <Button 
                type="primary"
                onClick={handleSelectBid}
                className="ml-auto"
              >
                Select Bid
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}