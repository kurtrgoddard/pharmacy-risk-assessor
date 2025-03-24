
import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Processing your document..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 w-full h-full rounded-full border-4 border-pharmacy-lightBlue opacity-25"></div>
        <div className="absolute top-0 w-full h-full rounded-full border-4 border-pharmacy-blue opacity-75 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-pharmacy-darkBlue font-medium">{message}</p>
      <p className="text-pharmacy-gray text-sm mt-2 max-w-sm text-center">
        This may take a moment as we analyze the document and generate your assessment
      </p>
    </div>
  );
};

export default LoadingIndicator;
