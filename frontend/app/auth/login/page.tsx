'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Checkbox, Alert, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { login, setCredentials } from '../../../lib/redux/slices/authSlice';
import type { AppDispatch } from '../../../lib/redux/store';
import AuthLayout from '../../../components/auth/AuthLayout';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string; password: string; remember: boolean }) => {
    setLoading(true);
    setError(null);
    
    try {
     const response = await dispatch(login({ 
        email: values.email, 
        password: values.password 
      })).unwrap();

      console.log("response---->", response)
    
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your account to continue"
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
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        className="animate-fade-in"
      >
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
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-neutral-400" />} 
            placeholder="••••••••" 
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-6">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          
          <Link 
            href="/auth/forgot-password" 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </Link>
        </div>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="w-full"
          >
            Log In
          </Button>
        </Form.Item>
        
        <Divider plain className="text-neutral-500">
          Don&apos;t have an account?
        </Divider>
        
        <Button 
          block 
          href="/auth/register" 
          className="mt-2"
        >
          Create an Account
        </Button>
      </Form>
    </AuthLayout>
  );
}