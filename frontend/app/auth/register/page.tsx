'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Radio, Alert, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { register } from '../../../lib/redux/slices/authSlice';
import type { AppDispatch } from '../../../lib/redux/store';
import AuthLayout from '../../../components/auth/AuthLayout';

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (values: { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string;
    role: 'BUYER' | 'SELLER';
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      await dispatch(register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      })).unwrap();
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our community to start bidding or posting projects"
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mb-6"
          closable
          onClose={() => setError(null)}
        />
      )}
      
      <Form
        name="register-form"
        initialValues={{ role: 'BUYER' }}
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        className="animate-fade-in"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: 'Please enter your full name' },
            { min: 3, message: 'Name must be at least 3 characters' },
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-neutral-400" />} 
            placeholder="John Doe" 
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input 
            prefix={<MailOutlined className="text-neutral-400" />} 
            placeholder="your@email.com" 
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined className="text-neutral-400" />} 
            placeholder="••••••••" 
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-neutral-400" />} 
            placeholder="••••••••" 
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="I want to"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Radio.Group className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Radio.Button 
                  value="BUYER" 
                  className="w-full h-auto py-3 px-4 flex flex-col items-center justify-center"
                >
                  <span className="font-medium">Buyer</span>
                </Radio.Button>
              </div>
              
              <div className="col-span-1">
                <Radio.Button 
                  value="SELLER" 
                  className="w-full h-auto py-3 px-4 flex flex-col items-center justify-center"
                >
                  <span className="font-medium">Seller</span>
                </Radio.Button>
              </div>
            </div>
          </Radio.Group>
        </Form.Item>

        <Form.Item className="mt-6">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </Form.Item>
        
        <p className="text-xs text-center text-neutral-500 mt-4">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-primary-600 hover:text-primary-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
            Privacy Policy
          </Link>
        </p>
        
        <Divider plain className="text-neutral-500 mt-6">
          Already have an account?
        </Divider>
        
        <Button 
          block 
          href="/auth/login" 
          className="mt-2"
        >
          Log In
        </Button>
      </Form>
    </AuthLayout>
  );
}