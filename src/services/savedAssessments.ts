
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';

export interface SavedAssessment {
  id: string;
  name: string;
  data: RiskAssessmentData;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

const STORAGE_KEY = 'napra-saved-assessments';

export class SavedAssessmentsService {
  static getAll(): SavedAssessment[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const assessments = JSON.parse(stored);
      return assessments.map((assessment: any) => ({
        ...assessment,
        createdAt: new Date(assessment.createdAt),
        updatedAt: new Date(assessment.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading saved assessments:', error);
      return [];
    }
  }

  static save(assessment: SavedAssessment): void {
    try {
      const assessments = this.getAll();
      const existingIndex = assessments.findIndex(a => a.id === assessment.id);
      
      if (existingIndex >= 0) {
        assessments[existingIndex] = { ...assessment, updatedAt: new Date() };
      } else {
        assessments.push(assessment);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw new Error('Failed to save assessment');
    }
  }

  static delete(id: string): void {
    try {
      const assessments = this.getAll().filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw new Error('Failed to delete assessment');
    }
  }

  static duplicate(id: string, newName: string): SavedAssessment {
    const assessment = this.getAll().find(a => a.id === id);
    if (!assessment) throw new Error('Assessment not found');
    
    const duplicated: SavedAssessment = {
      ...assessment,
      id: crypto.randomUUID(),
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.save(duplicated);
    return duplicated;
  }

  static search(query: string): SavedAssessment[] {
    const assessments = this.getAll();
    const lowercaseQuery = query.toLowerCase();
    
    return assessments.filter(assessment => 
      assessment.name.toLowerCase().includes(lowercaseQuery) ||
      assessment.data.preparationName.toLowerCase().includes(lowercaseQuery) ||
      assessment.data.pharmacyName.toLowerCase().includes(lowercaseQuery)
    );
  }
}
