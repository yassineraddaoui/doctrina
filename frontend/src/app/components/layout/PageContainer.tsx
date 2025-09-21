'use client';

import React from 'react';
import { cn } from '../utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = true
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={cn(
        'mx-auto',
        maxWidthClasses[maxWidth],
        padding && 'px-4 sm:px-6 lg:px-8 py-8',
        className
      )}>
        {children}
      </div>
    </div>
  );
};