
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SavedAssessment, SavedAssessmentsService } from '@/services/savedAssessments';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface SaveAssessmentDialogProps {
  assessmentData: RiskAssessmentData;
  children?: React.ReactNode;
}

const SaveAssessmentDialog: React.FC<SaveAssessmentDialogProps> = ({ 
  assessmentData, 
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name for the assessment');
      return;
    }

    setIsSaving(true);
    try {
      const savedAssessment: SavedAssessment = {
        id: crypto.randomUUID(),
        name: name.trim(),
        data: assessmentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      SavedAssessmentsService.save(savedAssessment);
      toast.success('Assessment saved successfully');
      setOpen(false);
      setName('');
    } catch (error) {
      toast.error('Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  const generateDefaultName = () => {
    const date = new Date().toLocaleDateString();
    const preparation = assessmentData.preparationName || 'Compound';
    return `${preparation} - ${date}`;
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !name) {
      setName(generateDefaultName());
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Assessment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Assessment</DialogTitle>
          <DialogDescription>
            Give your assessment a name so you can easily find and reuse it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Enter assessment name..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Assessment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveAssessmentDialog;
