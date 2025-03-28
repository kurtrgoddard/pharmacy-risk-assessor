
import React, { useState } from "react";
import { FileText, Download, Eye, EyeOff, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface DocumentPreviewProps {
  pdfData: string;
  fileName: string;
  documentType: "Risk Assessment" | "Master Formula";
  onValidateData?: () => void;
  isValidated?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  pdfData, 
  fileName,
  documentType,
  onValidateData,
  isValidated = false
}) => {
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${documentType} downloaded successfully`);
  };
  
  const handlePrint = () => {
    const printWindow = window.open(pdfData, '_blank');
    if (printWindow) {
      printWindow.onload = function() {
        printWindow.print();
      };
    } else {
      toast.error("Please allow popups to print the document");
    }
  };

  const togglePreview = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  return (
    <div className="w-full animate-fade-up">
      <div className="rounded-xl overflow-hidden border border-pharmacy-lightBlue/30">
        <div className="flex items-center justify-between p-4 bg-pharmacy-neutral">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-pharmacy-blue mr-2" />
            <h3 className="font-medium text-pharmacy-darkBlue">{documentType}</h3>
          </div>
          <div className="flex space-x-2">
            {onValidateData && (
              <Button 
                variant={isValidated ? "outline" : "default"}
                size="sm"
                onClick={onValidateData}
                className={`flex items-center text-xs ${isValidated ? 'text-green-600 border-green-600' : 'bg-pharmacy-blue hover:bg-pharmacy-darkBlue'}`}
              >
                <Check className="w-4 h-4 mr-1" />
                {isValidated ? "Validated" : "Validate Data"}
              </Button>
            )}
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
              variant="outline" 
              size="sm"
              onClick={handlePrint}
              className="flex items-center text-xs"
            >
              <Printer className="w-4 h-4 mr-1" />
              Print
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
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isPreviewExpanded ? 'h-[800px]' : 'h-[500px]'}`}>
          <iframe 
            src={pdfData} 
            className="w-full h-full"
            title={`${documentType} Preview`}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
