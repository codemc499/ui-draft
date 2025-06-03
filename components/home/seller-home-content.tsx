'use client'; // Assuming child components might need client interactivity

import React from 'react';
import { WorkerSidebar } from '@/components/worker/worker-sidebar'; // Adjust path if needed
import { WorkerMainContent } from '@/components/worker/worker-main-content'; // Adjust path if needed
import { WorkerRightSidebar } from '@/components/worker/worker-right-sidebar'; // Adjust path if needed
import { User, Job } from '@/utils/supabase/types'; // Import User and Job types

interface SellerHomeContentProps {
  userProfile: User; // Accept user profile as prop
  recentJobs: Job[]; // Add recentJobs prop
}

// Renamed from WorkerHomePage
export default function SellerHomeContent({ userProfile, recentJobs }: SellerHomeContentProps) {
  // Pass userProfile and recentJobs down to child components
  return (
    <div className='bg-bg-subtle-0 flex flex-1 gap-6 p-8'>
      <WorkerSidebar userProfile={userProfile} />
      <WorkerMainContent userProfile={userProfile} recentJobs={recentJobs} />
      <WorkerRightSidebar userProfile={userProfile} />
    </div>
  );
} 