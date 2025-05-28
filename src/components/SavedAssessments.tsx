
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SavedAssessment, SavedAssessmentsService } from '@/services/savedAssessments';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import { Search, Copy, Trash2, Calendar, Building, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface SavedAssessmentsProps {
  onLoadAssessment: (data: RiskAssessmentData) => void;
}

const SavedAssessments: React.FC<SavedAssessmentsProps> = ({ onLoadAssessment }) => {
  const [assessments, setAssessments] = useState<SavedAssessment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAssessments, setFilteredAssessments] = useState<SavedAssessment[]>([]);

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAssessments(assessments);
    } else {
      setFilteredAssessments(SavedAssessmentsService.search(searchQuery));
    }
  }, [searchQuery, assessments]);

  const loadAssessments = () => {
    const saved = SavedAssessmentsService.getAll();
    setAssessments(saved.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
  };

  const handleDelete = (id: string) => {
    try {
      SavedAssessmentsService.delete(id);
      loadAssessments();
      toast.success('Assessment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete assessment');
    }
  };

  const handleDuplicate = (assessment: SavedAssessment) => {
    const newName = `${assessment.name} (Copy)`;
    try {
      SavedAssessmentsService.duplicate(assessment.id, newName);
      loadAssessments();
      toast.success('Assessment duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate assessment');
    }
  };

  const handleLoad = (assessment: SavedAssessment) => {
    onLoadAssessment(assessment.data);
    toast.success(`Loaded assessment: ${assessment.name}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">{filteredAssessments.length} assessments</Badge>
      </div>

      {filteredAssessments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              {searchQuery ? 'No assessments found matching your search.' : 'No saved assessments yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{assessment.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {assessment.data.preparationName}
                      </span>
                      <span className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {assessment.data.pharmacyName}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={
                    assessment.data.riskLevel === 'high' ? 'destructive' :
                    assessment.data.riskLevel === 'medium' ? 'default' : 'secondary'
                  }>
                    {assessment.data.riskLevel.toUpperCase()} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Updated {formatDate(assessment.updatedAt)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoad(assessment)}
                    >
                      Load
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(assessment)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{assessment.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(assessment.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAssessments;
