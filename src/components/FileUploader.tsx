
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
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file");
      setIsLoading(false);
      toast.error("Invalid file format. Please upload a PDF file.");
      return;
    }
    
    try {
      // Extract text from PDF
      const extractedText = await extractTextFromPdf(file);
      console.log("Extracted text from PDF:", extractedText.substring(0, 500) + "...");
      
      // Attach the extracted text to the file object for use later
      const fileWithExtractedText = Object.assign(file, { extractedText });
      
      setSelectedFile(fileWithExtractedText);
      onFileUploaded(fileWithExtractedText, extractedText);
    } catch (err) {
      console.error("Error processing PDF:", err);
      setError("Error processing PDF");
      toast.error("Failed to process PDF. Please try again or try another file.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      // Read the file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log(`PDF loaded: ${pdf.numPages} pages`);
      
      // Extract text from each page
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i}/${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + "\n\n";
      }
      
      console.log(`Extracted ${fullText.length} characters of text`);
      
      // Improved detection for ingredient sections with more comprehensive patterns
      const ingredientSectionPatterns = [
        /ingredient[s:]|active ingredient[s:]/i,
        /drug[s:]\s*substance/i,
        /formulation:/i,
        /composition:/i,
        /formula[tion]*:/i,
        /components?:/i
      ];
      
      // Log each pattern match separately for better debugging
      for (const pattern of ingredientSectionPatterns) {
        const match = fullText.match(pattern);
        if (match) {
          console.log(`Found potential ingredient section with pattern "${pattern}" at position ${match.index}`);
        }
      }
      
      // Enhanced detection for specific ingredients
      const commonIngredients = [
        "Omeprazole", "Ketoprofen", "Gabapentin", "Baclofen", "Ketamine", 
        "Lidocaine", "Estradiol", "Clonidine", "Diclofenac", "Amitriptyline"
      ];
      
      // Log if we find any known ingredients in the text
      for (const ingredient of commonIngredients) {
        if (fullText.toLowerCase().includes(ingredient.toLowerCase())) {
          console.log(`Detected ${ingredient} in document`);
        }
      }
      
      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging 
          ? 'border-pharmacy-blue bg-pharmacy-blue/5' 
          : isLoading 
            ? 'border-pharmacy-neutral cursor-wait' 
            : selectedFile 
              ? 'border-green-400 bg-green-50/30' 
              : 'border-pharmacy-neutral hover:border-pharmacy-blue/70 hover:bg-pharmacy-blue/5'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".pdf"
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isLoading 
            ? 'bg-pharmacy-neutral/30'
            : selectedFile
              ? 'bg-green-100'
              : 'bg-pharmacy-blue/10'
        }`}>
          {isLoading ? (
            <div className="w-8 h-8 border-4 border-pharmacy-blue/30 border-t-pharmacy-blue rounded-full animate-spin" />
          ) : selectedFile ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <Upload className="h-8 w-8 text-pharmacy-blue/70" />
          )}
        </div>
        
        {isLoading ? (
          <div>
            <h3 className="text-lg font-medium text-pharmacy-darkBlue">Processing PDF...</h3>
            <p className="text-sm text-pharmacy-gray mt-1">Extracting text and analyzing content</p>
          </div>
        ) : selectedFile ? (
          <div>
            <h3 className="text-lg font-medium text-green-600">{selectedFile.name}</h3>
            <p className="text-sm text-pharmacy-gray mt-1">
              PDF uploaded successfully - {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            <button
              onClick={handleButtonClick}
              className="text-sm text-pharmacy-blue hover:text-pharmacy-darkBlue mt-2"
            >
              Upload a different file
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-pharmacy-darkBlue">Upload PDF Document</h3>
            <p className="text-sm text-pharmacy-gray mt-1">
              Drag & drop your formula PDF file here, or click to browse
            </p>
            <p className="text-xs text-pharmacy-gray/70 mt-4">
              Accepts PDFs from PCCA, Medisca or other compounding formula sources
            </p>
            
            <button
              onClick={handleButtonClick}
              className="mt-4 px-4 py-2 bg-pharmacy-blue/10 text-pharmacy-blue rounded-md hover:bg-pharmacy-blue/20 transition-colors text-sm font-medium"
            >
              Select PDF file
            </button>
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
