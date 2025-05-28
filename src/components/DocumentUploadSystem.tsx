
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  Download
} from "lucide-react";

interface ExtractedIngredient {
  name: string;
  concentration: string;
  confidence: number;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  extractedIngredients?: ExtractedIngredient[];
  processingStatus: 'uploading' | 'processing' | 'completed' | 'error';
}

const DocumentUploadSystem = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);

  // Simulated OCR extraction (in real implementation, this would use Tesseract.js)
  const simulateOCRExtraction = async (file: File): Promise<ExtractedIngredient[]> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock extracted ingredients based on common compounds
    const mockIngredients: ExtractedIngredient[] = [
      { name: "Ketoprofen", concentration: "10%", confidence: 0.95 },
      { name: "PLO Gel Base", concentration: "q.s. to 100g", confidence: 0.88 },
      { name: "Methylparaben", concentration: "0.1%", confidence: 0.82 }
    ];
    
    return mockIngredients;
  };

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
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}. Please upload PDF, JPG, or PNG files.`);
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }

      const documentId = crypto.randomUUID();
      const newDocument: UploadedDocument = {
        id: documentId,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        processingStatus: 'uploading'
      };

      setDocuments(prev => [...prev, newDocument]);
      toast.success(`Uploading ${file.name}...`);

      try {
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update status to processing
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, processingStatus: 'processing' as const }
            : doc
        ));

        toast.info(`Extracting ingredients from ${file.name}...`);

        // Extract ingredients using OCR
        const extractedIngredients = await simulateOCRExtraction(file);

        // Update document with extracted data
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                processingStatus: 'completed' as const,
                extractedIngredients 
              }
            : doc
        ));

        toast.success(`Successfully extracted ${extractedIngredients.length} ingredients from ${file.name}`);

      } catch (error) {
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, processingStatus: 'error' as const }
            : doc
        ));
        toast.error(`Failed to process ${file.name}. Please try again.`);
      }
    }
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    if (selectedDocument?.id === documentId) {
      setSelectedDocument(null);
    }
    toast.success("Document removed");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: UploadedDocument['processingStatus']) => {
    switch (status) {
      case 'uploading': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: UploadedDocument['processingStatus']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Extracting ingredients...';
      case 'completed': return 'Ready';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8">
          <div
            className={`text-center transition-all duration-200 ${
              dragActive ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
            } border-2 border-dashed rounded-lg p-8`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Prescription or Formula
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Supports PDF, JPG, PNG • Max 10MB per file
            </p>
            
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button type="button" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Select Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              Click on a document to view extracted ingredients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDocument?.id === doc.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-center space-x-3">
                    {doc.type.includes('pdf') ? (
                      <FileText className="h-8 w-8 text-red-500" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.processingStatus)}`} />
                      <span className="text-sm">{getStatusText(doc.processingStatus)}</span>
                    </div>
                    
                    {doc.processingStatus === 'processing' && (
                      <Progress value={Math.random() * 100} className="w-20" />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDocument(doc.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Ingredients Display */}
      {selectedDocument?.extractedIngredients && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Extracted Ingredients</CardTitle>
                <CardDescription>
                  From: {selectedDocument.name}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Ingredients
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDocument.extractedIngredients.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{ingredient.name}</p>
                    <p className="text-sm text-gray-600">{ingredient.concentration}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={ingredient.confidence > 0.9 ? 'default' : 
                              ingredient.confidence > 0.7 ? 'secondary' : 'outline'}
                    >
                      {Math.round(ingredient.confidence * 100)}% confidence
                    </Badge>
                    {ingredient.confidence < 0.8 && (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Button className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Use These Ingredients for Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUploadSystem;
