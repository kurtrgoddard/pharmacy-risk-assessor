
import React from "react";
import { Info } from "lucide-react";

const GuidelinesInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mt-4">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-blue-900">NAPRA Guidelines</h4>
          <p className="text-xs text-blue-800 mt-1">
            <strong>Level A:</strong> Simple compounding with low risk, prepared in a non-segregated compounding area.<br />
            <strong>Level B:</strong> Complex compounding or moderate hazard, requires segregated compounding area.<br />
            <strong>Level C:</strong> Complex compounding with high hazard, requires dedicated room with appropriate C-PEC.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesInfo;
