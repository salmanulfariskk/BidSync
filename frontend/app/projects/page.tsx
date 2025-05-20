'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Button, Input, Select, Empty, Pagination, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../lib/redux/slices/projectsSlice';
import { RootState, AppDispatch } from '../../lib/redux/store';
import AppLayout from '../../components/layout/AppLayout';
import ProjectCard from '../../components/projects/ProjectCard';

const { Option } = Select;

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects, loading } = useSelector((state: RootState) => state.projects);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  
  // Filter projects
  const filteredProjects = projects.filter(project => {
    // For buyers, only show their own projects
    if (user?.role === 'BUYER' && project.buyerId !== user.id) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter && project.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Paginate projects
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + pageSize);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleStatusFilter = (value: string | null) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  
  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Projects</h1>
        
        {user?.role === 'BUYER' && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/projects/create')}
          >
            Create New Project
          </Button>
        )}
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search projects..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearch}
          allowClear
          className="sm:w-64"
        />
        
        <Select
          placeholder="Filter by status"
          allowClear
          onChange={handleStatusFilter}
          className="w-full sm:w-48"
          suffixIcon={<FilterOutlined />}
        >
          <Option value="pending">Pending</Option>
          <Option value="in_progress">In Progress</Option>
          <Option value="completed">Completed</Option>
        </Select>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <Empty
          description={
            searchTerm || statusFilter 
              ? "No projects match your search criteria" 
              : "You haven't created any projects yet"
          }
          className="my-12"
        >
          {user?.role === 'BUYER' && !(searchTerm || statusFilter) && (
            <Button
              type="primary"
              onClick={() => router.push('/projects/create')}
              icon={<PlusOutlined />}
            >
              Create Your First Project
            </Button>
          )}
        </Empty>
      ) : (
        <div className="animate-fade-in">
          <Row gutter={[16, 16]}>
            {paginatedProjects.map((project) => (
              <Col key={project.id} xs={24} md={12} lg={8} className="mb-4">
                <ProjectCard
                  project={project}
                  isBuyer={user?.role === 'BUYER'}
                />
              </Col>
            ))}
          </Row>
          
          {filteredProjects.length > pageSize && (
            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredProjects.length}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}