
import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileUploaded: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check if file is PDF
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setSelectedFile(file);
    onFileUploaded(file);
    toast.success("File uploaded successfully");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-up">
      <div 
        className={`file-drop-area p-8 flex flex-col items-center justify-center cursor-pointer group ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input 
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf"
        />
        
        <div className="w-16 h-16 rounded-full bg-pharmacy-blue/10 flex items-center justify-center mb-4 group-hover:bg-pharmacy-blue/20 transition-all duration-300">
          <Upload className="w-8 h-8 text-pharmacy-blue" />
        </div>
        
        <h3 className="text-lg font-medium text-pharmacy-darkBlue mb-2">
          {selectedFile ? selectedFile.name : "Upload PDF Document"}
        </h3>
        
        <p className="text-pharmacy-gray text-sm text-center max-w-md mb-2">
          Drag and drop your technical PDF document here, or click to browse
        </p>
        
        <p className="text-pharmacy-gray/70 text-xs">
          Supports: PDF (Max 10MB)
        </p>
      </div>
      
      {selectedFile && (
        <div className="mt-4 text-center">
          <p className="text-sm text-pharmacy-gray">
            File selected: <span className="font-medium text-pharmacy-darkBlue">{selectedFile.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
