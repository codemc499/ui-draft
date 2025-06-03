// components/auth/LoginFormSkeleton.tsx
import React from 'react';

export default function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-md space-y-6 animate-pulse">
      {/* title */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
      <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />

      {/* inputs */}
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>

      {/* button */}
      <div className="h-12 bg-gray-200 rounded w-full" />
    </div>
  );
}
