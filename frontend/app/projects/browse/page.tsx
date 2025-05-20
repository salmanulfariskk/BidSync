'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Input, Select, Empty, Pagination, Spin, Slider, Button } from 'antd';
import { SearchOutlined, FilterOutlined, DollarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, Project } from '../../../lib/redux/slices/projectsSlice';
import { RootState, AppDispatch } from '../../../lib/redux/store';
import AppLayout from '../../../components/layout/AppLayout';
import ProjectCard from '../../../components/projects/ProjectCard';
import axios from '../../../lib/axios';


export default function BrowseProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    fetchProject();
  }, []);
  

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/projects`);
      setProjects(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }
  
  // Only show pending projects that are open for bids
  const availableProjects = projects.filter(project => project.status === 'PENDING');
  
  // Apply filters
  const filteredProjects = availableProjects.filter(project => {
    // Apply search filter
    if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply price range filter
    if (
      (project.budget.min > priceRange[1]) || 
      (project.budget.max < priceRange[0])
    ) {
      return false;
    }
    
    return true;
  });
  
  // Sort projects by creation date (newest first)
  const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Paginate projects
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + pageSize);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setCurrentPage(1);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Browse Projects</h1>
        <p className="text-neutral-500">Find projects that match your skills and expertise</p>
      </div>
      
      {/* Search & Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Search projects..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearch}
            allowClear
            className="flex-grow sm:w-64"
          />
          
          <Button
            icon={<FilterOutlined />}
            onClick={toggleFilters}
            className="sm:w-auto"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {showFilters && (
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-md mb-4 animate-fade-in">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <DollarOutlined className="mr-2" />
                <span className="font-medium">Budget Range</span>
              </div>
              <Slider
                range
                min={0}
                max={5000}
                value={priceRange}
                onChange={handlePriceRangeChange}
                tipFormatter={value => `$${value}`}
              />
              <div className="flex justify-between text-sm text-neutral-500">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Projects List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      ) : projects.length === 0 ? (
        <Empty
          description={
            searchTerm || priceRange[0] > 0 || priceRange[1] < 5000
              ? "No projects match your search criteria"
              : "No projects available at the moment"
          }
          className="my-12"
        />
      ) : (
        <div className="animate-fade-in">
          <Row gutter={[16, 16]}>
            {projects?.map((project) => (
              <Col key={project.id} xs={24} md={12} lg={8} className="mb-4">
                <ProjectCard project={project} />
              </Col>
            ))}
          </Row>
          
          {projects?.length > pageSize && (
            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={projects.length}
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