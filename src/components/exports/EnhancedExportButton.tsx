
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Download, Share, Mail, FileText, QrCode, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { ExportService } from '@/services/exportService';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';
import ShareAssessmentDialog from './ShareAssessmentDialog';

interface EnhancedExportButtonProps {
  assessment: RiskAssessmentData | KeswickAssessmentData;
  pdfUrl?: string;
  fileName?: string;
}

const EnhancedExportButton: React.FC<EnhancedExportButtonProps> = ({
  assessment,
  pdfUrl,
  fileName = 'risk-assessment'
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCSVExport = () => {
    try {
      const csvContent = ExportService.exportToCSV(assessment);
      downloadFile(csvContent, `${fileName}.csv`, 'text/csv');
      toast.success('CSV file downloaded successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const handleJSONExport = () => {
    try {
      const jsonContent = ExportService.exportToJSON(assessment);
      downloadFile(jsonContent, `${fileName}.json`, 'application/json');
      toast.success('JSON file downloaded successfully');
    } catch (error) {
      toast.error('Failed to export JSON');
    }
  };

  const handlePDFDownload = () => {
    if (!pdfUrl) {
      toast.error('PDF not available');
      return;
    }
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('PDF downloaded successfully');
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else {
      window.print();
    }
  };

  const handleEmailReport = () => {
    try {
      const emailLink = ExportService.createEmailLink(assessment);
      window.location.href = emailLink;
      toast.success('Email client opened');
    } catch (error) {
      toast.error('Failed to open email client');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="bg-pharmacy-blue hover:bg-pharmacy-darkBlue">
            <Download className="mr-2 h-4 w-4" />
            Export & Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Export Formats</DropdownMenuLabel>
          <DropdownMenuItem onClick={handlePDFDownload}>
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCSVExport}>
            <FileText className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleJSONExport}>
            <FileText className="mr-2 h-4 w-4" />
            Export as JSON
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Share & Print</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
            <Share className="mr-2 h-4 w-4" />
            Create Shareable Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEmailReport}>
            <Mail className="mr-2 h-4 w-4" />
            Email Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Assessment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareAssessmentDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        assessment={assessment}
      />
    </>
  );
};

export default EnhancedExportButton;
