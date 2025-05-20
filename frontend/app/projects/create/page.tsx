'use client';

import { Card } from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '../../../lib/redux/store';
import AppLayout from '../../../components/layout/AppLayout';
import ProjectForm from '../../../components/forms/ProjectForm';

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Redirect if not a buyer
  useEffect(() => {
    if (user && user.role !== 'BUYER') {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  if (!user || user.role !== 'BUYER') {
    return null;
  }
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-neutral-500">Fill in the details below to post your project</p>
      </div>
      
      <Card className="animate-fade-in">
        <ProjectForm />
      </Card>
    </AppLayout>
  );
}