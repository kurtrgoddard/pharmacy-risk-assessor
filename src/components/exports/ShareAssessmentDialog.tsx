
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExportService } from '@/services/exportService';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';
import { Share, Copy, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface ShareAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: RiskAssessmentData | KeswickAssessmentData;
}

const ShareAssessmentDialog: React.FC<ShareAssessmentDialogProps> = ({
  open,
  onOpenChange,
  assessment
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const url = ExportService.createShareableLink(assessment, parseInt(expiryHours));
      setShareUrl(url);
      toast.success('Shareable link created successfully');
    } catch (error) {
      toast.error('Failed to create shareable link');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const getQRCodeUrl = () => {
    if (!shareUrl) return '';
    return ExportService.generateQRCodeData(shareUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share className="mr-2 h-5 w-5" />
            Share Assessment
          </DialogTitle>
          <DialogDescription>
            Create a secure shareable link for this risk assessment. The link will expire automatically for security.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry" className="text-right">
              Expires in
            </Label>
            <Select value={expiryHours} onValueChange={setExpiryHours}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="72">3 days</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {!shareUrl && (
            <Button 
              onClick={handleGenerateLink} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Shareable Link'}
            </Button>
          )}
          
          {shareUrl && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shareUrl" className="text-right">
                  Share URL
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="shareUrl"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="text-center">
                  <Label className="text-sm font-medium">QR Code</Label>
                  <div className="mt-2 p-4 bg-white rounded-lg border">
                    <img 
                      src={getQRCodeUrl()} 
                      alt="QR Code for sharing" 
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Scan to access assessment
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareAssessmentDialog;
