
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileFormWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const MobileFormWrapper: React.FC<MobileFormWrapperProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
      // Mobile-specific optimizations
      "touch-manipulation", // Improves touch responsiveness
      className
    )}>
      <div className="space-y-6 sm:space-y-8">
        {children}
      </div>
    </div>
  );
};

export default MobileFormWrapper;
