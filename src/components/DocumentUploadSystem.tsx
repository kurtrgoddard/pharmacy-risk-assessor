
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X, 
  CheckCircle
} from "lucide-react";

interface DocumentUploadSystemProps {
  onDocumentProcessed: (document: any) => void;
}

const DocumentUploadSystem = ({ onDocumentProcessed }: DocumentUploadSystemProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const processFile = async (file: File) => {
    console.log("Processing file:", file.name, file.type, file.size);
    
    // Validate file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type not supported: ${file.name}. Please upload PDF, JPG, or PNG files.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      
      toast.success(`Successfully processed ${file.name}`);
      
      // Return processed document
      onDocumentProcessed({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        extractedIngredients: [
          'Ketoprofen',
          'PLO Gel Base', 
          'Methylparaben'
        ]
      });

    } catch (error) {
      toast.error(`Failed to process ${file.name}. Please try again.`);
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed:", e.target.files);
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleButtonClick = () => {
    console.log("Select file button clicked");
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-6">
        <div
          className={`text-center transition-all duration-200 ${
            dragActive ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
          } border-2 border-dashed rounded-lg p-6`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing Document...
                </h3>
                <p className="text-gray-600 mb-4">
                  Extracting ingredients and analyzing safety data
                </p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-gray-500 mt-2">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Formula Document
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Supports PDF, JPG, PNG • Max 10MB per file
              </p>
              
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={isProcessing}
              />
              
              <Button 
                type="button" 
                onClick={handleButtonClick}
                disabled={isProcessing}
                className="cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadSystem;
