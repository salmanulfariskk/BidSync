'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, InputNumber, DatePicker, Button, Upload, Space, Alert, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { UploadOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { createProject, updateProject } from '../../lib/redux/slices/projectsSlice';
import type { AppDispatch } from '../../lib/redux/store';
import type { Project } from '../../lib/redux/slices/projectsSlice';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface ProjectFormProps {
  initialData?: Project;
  isEditing?: boolean;
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
}

export default function ProjectForm({ 
  initialData, 
  isEditing = false, 
  onSuccess, 
  onCancel 
}: ProjectFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectData = {
        title: values.title,
        description: values.description,
        budget: {
          min: values.budgetMin,
          max: values.budgetMax,
        },
        deadline: values.deadline.format('YYYY-MM-DD'),
      };

      let response;
      
      if (isEditing && initialData) {
        response = await dispatch(updateProject({
          id: initialData.id,
          projectData,
        })).unwrap();
        
        notification.success({
          message: 'Project Updated',
          description: 'Your project has been successfully updated.',
        });
      } else {
        response = await dispatch(createProject(projectData)).unwrap();
        
        notification.success({
          message: 'Project Created',
          description: 'Your project has been successfully created.',
        });
      }
      
      if (onSuccess) {
        onSuccess(response);
      } else {
        router.push(`/projects`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Set initial form values if editing
  useState(() => {
    if (isEditing && initialData) {
      form.setFieldsValue({
        title: initialData.title,
        description: initialData.description,
        budgetMin: initialData.budget.min,
        budgetMax: initialData.budget.max,
        deadline: dayjs(initialData.deadline),
      });
      
      // Set file list if there are attached files
      if (initialData.files && initialData.files.length > 0) {
        setFileList(
          initialData.files.map((file) => ({
            uid: file.id,
            name: file.name,
            status: 'done',
            url: file.url,
          }))
        );
      }
    }
  });

  return (
    <div className="animate-fade-in">
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
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
        requiredMark={false}
      >
        <Form.Item
          name="title"
          label="Project Title"
          rules={[{ required: true, message: 'Please enter a project title' }]}
        >
          <Input 
            placeholder="Enter a descriptive title for your project" 
            className="rounded-md"
          />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Project Description"
          rules={[
            { required: true, message: 'Please provide a project description' },
            { min: 10, message: 'Description must be at least 10 characters' },
          ]}
        >
          <TextArea
            placeholder="Describe your project in detail including requirements, expectations, and any specific skills needed"
            autoSize={{ minRows: 4, maxRows: 8 }}
            className="rounded-md"
          />
        </Form.Item>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="budgetMin"
            label="Minimum Budget ($)"
            rules={[
              { required: true, message: 'Please set a minimum budget' },
              { type: 'number', min: 5, message: 'Minimum budget must be at least $5' },
            ]}
          >
            <InputNumber
              min={5}
              placeholder="50"
              className="w-full rounded-md"
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          
          <Form.Item
            name="budgetMax"
            label="Maximum Budget ($)"
            rules={[
              { required: true, message: 'Please set a maximum budget' },
              { type: 'number', min: 5, message: 'Maximum budget must be at least $5' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('budgetMin') <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Maximum budget must be greater than minimum budget'));
                },
              }),
            ]}
          >
            <InputNumber
              min={5}
              placeholder="500"
              className="w-full rounded-md"
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        </div>
        
        <Form.Item
          name="deadline"
          label="Project Deadline"
          rules={[
            { required: true, message: 'Please set a project deadline' },
            {
              validator: (_, value) => {
                if (value && value.isBefore(dayjs().add(2, 'day'))) {
                  return Promise.reject(new Error('Deadline must be at least 2 days from now'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker 
            className="w-full rounded-md" 
            disabledDate={(current) => current && current < dayjs().endOf('day')}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        
        <Form.Item
          name="attachments"
          label="Attachments (Optional)"
          tooltip="Upload any relevant files or documents that will help sellers understand your project better"
        >
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            maxCount={5}
            multiple
          >
            <Button icon={<UploadOutlined />}>Upload Files</Button>
          </Upload>
        </Form.Item>
        
        <Form.Item className="mt-8">
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
            >
              {isEditing ? 'Update Project' : 'Create Project'}
            </Button>
            
            <Button
              onClick={onCancel || (() => router.back())}
              icon={<CloseOutlined />}
              size="large"
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}