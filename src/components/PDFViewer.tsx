
import React, { useState } from "react";
import { FileText, Download, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PDFViewerProps {
  pdfData: string;
  fileName: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfData, fileName }) => {
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = pdfData;
      link.download = fileName || "risk-assessment.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  const togglePreview = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-up">
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-pharmacy-neutral border-b">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-pharmacy-blue mr-2" />
            <h3 className="font-medium text-pharmacy-darkBlue">{fileName || "Risk Assessment"}</h3>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={togglePreview}
              className="flex items-center text-xs"
            >
              {isPreviewExpanded ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Collapse
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Expand
                </>
              )}
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleDownload}
              className="flex items-center text-xs bg-pharmacy-blue hover:bg-pharmacy-darkBlue"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isPreviewExpanded ? 'h-[800px]' : 'h-[400px]'}`}>
          {pdfData ? (
            <iframe 
              src={pdfData} 
              className="w-full h-full"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <p className="text-pharmacy-gray">No PDF data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
