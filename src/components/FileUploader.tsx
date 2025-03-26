
import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import { clearSdsCache } from "@/utils/mediscaAPI";

// Set the worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploaderProps {
  onFileUploaded: (file: File, extractedText?: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let extractedText = '';
      
      // Process all pages for more comprehensive extraction
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Improved text extraction with spacing consideration
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
          
        extractedText += pageText + ' ';
      }
      
      console.log("Extracted PDF Text (first 500 chars):", extractedText.substring(0, 500));
      return extractedText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const validateAndSetFile = async (file: File) => {
    // Reset everything before processing new file
    setError(null);
    setIsLoading(true);
    setSelectedFile(null);
    
    // Clear SDS cache when a new file is uploaded to prevent data persistence
    clearSdsCache();
    
    try {
      // Check if file is PDF
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        setError("Only PDF files are supported");
        setIsLoading(false);
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        setError("File size exceeds 10MB limit");
        setIsLoading(false);
        return;
      }

      // Extract text from PDF with improved extraction
      const extractedText = await extractTextFromPDF(file);
      
      // Add the extracted text to the file object for later use
      const fileWithText = Object.assign(file, { extractedText });
      
      setSelectedFile(fileWithText);
      onFileUploaded(fileWithText, extractedText);
      toast.success("File processed successfully");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process PDF file");
      setError("Failed to extract data from PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-up">
      <div 
        className={`file-drop-area p-8 flex flex-col items-center justify-center cursor-pointer group ${isDragging ? 'active' : ''} ${isLoading ? 'opacity-75 pointer-events-none' : ''}`}
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
          disabled={isLoading}
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
        
        {isLoading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-pharmacy-blue border-t-transparent rounded-full mr-2"></div>
            <span className="text-sm text-pharmacy-gray">Processing PDF...</span>
          </div>
        )}
        
        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
      
      {selectedFile && !isLoading && (
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
