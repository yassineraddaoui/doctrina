'use client';

import React from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false,
  onClick
}) => {
  return (
    <div 
      className={cn(
        'card',
        hover && 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn('card-header', className)}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn('card-body', className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn('card-footer', className)}>
      {children}
    </div>
  );
};