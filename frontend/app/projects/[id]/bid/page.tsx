"use client";

import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../../../components/layout/AppLayout";
import axios from "../../../../lib/axios";
import { createBid } from "../../../../lib/redux/slices/bidsSlice";
import { AppDispatch, RootState } from "../../../../lib/redux/store";

const { TextArea } = Input;

export default function PlaceBidPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState(null);

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/projects/${id}`);
      setCurrentProject(response.data);
      form.setFieldsValue({
        amount: response.data.budget.min,
        deliveryTime: 7,
      });
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching project:", error);
      setError("Failed to fetch project. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const projectId = Array.isArray(id) ? id[0] : id;

  if (user?.role !== "SELLER") {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    setError(null);

    try {
      await dispatch(
        createBid({
          projectId,
          amount: values.amount,
          deliveryTime: values.deliveryTime,
          message: values.message,
        })
      ).unwrap();

      notification.success({
        message: "Bid Submitted",
        description: "Your bid has been submitted successfully!",
      });

      router.push(`/projects/${projectId}`);
    } catch (err: any) {
      setError(err.message || "Failed to submit bid. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Place a Bid</h1>
        <p className="text-neutral-500">
          {currentProject?.title || "Loading project..."}
        </p>
      </div>

      <Card className="animate-fade-in">
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-6"
            closable
            onClose={() => setError(null)}
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="amount"
            label="Bid Amount ($)"
            rules={[
              { required: true, message: "Please enter your bid amount" },
              {
                type: "number",
                min: 5,
                message: "Bid amount must be at least $5",
              },
            ]}
            tooltip="Enter the amount you want to charge for this project"
          >
            <InputNumber
              min={5}
              className="w-full"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item
            name="deliveryTime"
            label="Delivery Time (Days)"
            rules={[
              { required: true, message: "Please enter delivery time" },
              {
                type: "number",
                min: 1,
                message: "Delivery time must be at least 1 day",
              },
            ]}
            tooltip="How many days will it take you to complete this project?"
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Cover Letter"
            rules={[
              {
                required: true,
                message: "Please write a message to the client",
              },
              {
                min: 10,
                message: "Your message should be at least 10 characters",
              },
            ]}
            tooltip="Explain why you're the best candidate for this project"
          >
            <TextArea
              rows={6}
              placeholder="Introduce yourself and explain why you're the best person for this job. Highlight your relevant skills and experience."
            />
          </Form.Item>
          <Row>
            <Col md={20} />
            <Col md={4}>
              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                  block
                >
                  Submit Bid
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </AppLayout>
  );
}
