import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import Fuse from "fuse.js";
import { clearSdsCache } from "@/utils/mediscaAPI";

// Set the worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const fuzzyMatch = (needle: string, haystack: string[]) => {
  const fuse = new Fuse(haystack, { includeScore: true, threshold: 0.15 });
  const res = fuse.search(needle);
  return res.length ? res[0].item : null;
};

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
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log(`PDF loaded: ${pdf.numPages} pages`);

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i}/${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((it: any) => it.str).join(" ") + "\n";
    }

    // Remove Medisca references
    fullText = fullText.replace(/medisca/gi, "");

    // Define common ingredients
    const commonIngredients = [
      "Estriol", "Estradiol", "Lansoprazole", "Ketamine", "Gabapentin",
      "Baclofen", "Clonidine", "Omeprazole", "Ketoprofen", "Amitriptyline",
      "Metformin", "Progesterone", "Testosterone", "Hydrocortisone", "Fluconazole",
      "Metronidazole", "Tretinoin", "Minoxidil", "Naltrexone", "Tacrolimus",
      "Amlodipine", "Carvedilol", "Dexamethasone", "Lisinopril", "Ranitidine",
      "Doxycycline", "Ibuprofen", "Melatonin", "Papaverine", "Sildenafil"
    ];

    // Exact matching first
    const found = commonIngredients
      .map(n => ({ n, hit: new RegExp(`\\b${n}\\b`, "i").test(fullText) }))
      .filter(x => x.hit)
      .map(x => x.n);

    // Fallback to fuzzy search if no exact matches
    if (!found.length) {
      const words = Array.from(new Set(fullText.match(/[A-Za-z]{5,}/g) || []));
      const maybe = words.map(w => fuzzyMatch(w, commonIngredients)).filter(Boolean);
      found.push(...new Set(maybe));
    }

    if (!found.length) {
      console.warn("No ingredient recognised in PDF");
    } else {
      console.log("Found ingredients:", found);
    }

    // Check for physical form descriptors
    const physicalForms = ["cream", "gel", "ointment", "solution", "suspension", "tablet", "capsule", "powder", "liquid", "lotion"];
    for (const form of physicalForms) {
      if (fullText.toLowerCase().includes(form.toLowerCase())) {
        console.log(`Detected physical form: ${form}`);
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
