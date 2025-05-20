'use client';

import { ReactNode } from 'react';
import { FaBriefcase } from 'react-icons/fa';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-50 ">
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-600">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800/90 to-primary-600/80 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url("https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}></div>
        <div className="relative z-20 flex flex-col justify-center px-12 w-full">
          <div className="mb-12">
            <div className="flex items-center mt-2">
              <FaBriefcase className="text-white text-3xl mr-3" />
              <h1 className="text-white text-3xl font-bold">ProBid</h1>
            </div>
            <p className="text-white/80 mt-2">The professional bidding platform</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-white text-2xl font-medium mb-4">Connect with top professionals</h2>
            <p className="text-white/80 mb-6">
              Whether you're looking to hire skilled professionals or find quality projects to work on, 
              ProBid is the platform you've been waiting for.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-white font-medium">For Buyers</h3>
                <p className="text-white/80 text-sm mt-1">Post projects and find skilled professionals</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-white font-medium">For Sellers</h3>
                <p className="text-white/80 text-sm mt-1">Discover projects and showcase your skills</p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <p className="text-white/60 text-sm">© 2025 ProBid. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-4 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center mb-6">
              <FaBriefcase className="text-primary-600 text-3xl mr-3" />
              <h1 className="text-3xl font-bold">ProBid</h1>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
            {subtitle && <p className="mt-2 text-neutral-600 dark:text-neutral-400">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}