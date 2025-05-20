"use client";

import {
    FilterOutlined,
    SearchOutlined
} from "@ant-design/icons";
import { Col, Empty, Input, Pagination, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AppLayout from "../../components/layout/AppLayout";
import BidCard from "../../components/projects/BidCard";
import axios from "../../lib/axios";
import { RootState } from "../../lib/redux/store";

const { Option } = Select;

export default function BidsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const filteredBids = bids.filter(bid => {
    const matchesSearch = bid.project?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || bid.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedBids = filteredBids.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/bids/seller");
      setBids(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  if (user?.role === "BUYER") {
    return false;
  }

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Bids</h1>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search bids..."
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
          <Option value="PENDING">Pending</Option>
          <Option value="ACCEPTED">Accepted</Option>
          <Option value="REJECTED">Rejected</Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      ) : filteredBids.length === 0 ? (
        <Empty
          description={
            searchTerm || statusFilter 
              ? "No bids match your search criteria" 
              : "You haven't placed any bids yet"
          }
          className="my-12"
        />
      ) : (
        <div className="animate-fade-in">
          <Row gutter={[16, 16]}>
            {paginatedBids.map((bid) => (
              <Col key={bid.id} xs={24} md={12} lg={8} className="mb-4">
                <BidCard
                  bid={bid}
                  isBuyer={user?.role === "BUYER"}
                />
              </Col>
            ))}
          </Row>

          {filteredBids.length > pageSize && (
            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredBids.length}
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
