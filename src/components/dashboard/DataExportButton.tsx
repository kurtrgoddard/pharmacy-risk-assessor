
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface DataExportButtonProps {
  onExport: () => any;
}

const DataExportButton: React.FC<DataExportButtonProps> = ({ onExport }) => {
  const handleExport = () => {
    try {
      const data = onExport();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Analytics data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <Button onClick={handleExport} className="flex items-center gap-2">
      <Download className="w-4 h-4" />
      Export Data
    </Button>
  );
};

export default DataExportButton;
