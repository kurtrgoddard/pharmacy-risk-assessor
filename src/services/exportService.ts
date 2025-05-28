
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';
import { SavedAssessment } from '@/services/savedAssessments';

export interface ShareableAssessment {
  id: string;
  data: RiskAssessmentData | KeswickAssessmentData;
  expiresAt: Date;
  createdAt: Date;
}

export class ExportService {
  private static SHARE_STORAGE_KEY = 'napra-shared-assessments';

  static exportToCSV(assessment: RiskAssessmentData | KeswickAssessmentData): string {
    const isKeswick = 'compoundName' in assessment;
    
    if (isKeswick) {
      const keswickData = assessment as KeswickAssessmentData;
      const csvData = [
        ['Field', 'Value'],
        ['Compound Name', keswickData.compoundName],
        ['DIN', keswickData.din],
        ['Risk Level', keswickData.riskLevel],
        ['Active Ingredients', keswickData.activeIngredients.map(ing => ing.name).join('; ')],
        ['Preparation Frequency', keswickData.preparationDetails.frequency],
        ['Quantity', keswickData.preparationDetails.quantity],
        ['Physical Characteristics', keswickData.physicalCharacteristics.join('; ')],
        ['Equipment Required', keswickData.equipmentRequired.join('; ')],
        ['PPE Gloves', keswickData.ppe.gloves],
        ['PPE Gown', keswickData.ppe.gown],
        ['PPE Mask', keswickData.ppe.mask],
        ['Eye Protection', keswickData.ppe.eyeProtection ? 'Yes' : 'No'],
        ['Ventilation Required', keswickData.safetyChecks.ventilationRequired ? 'Yes' : 'No'],
        ['Rationale', keswickData.rationale]
      ];
      
      return csvData.map(row => 
        row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
      ).join('\n');
    } else {
      const napraData = assessment as RiskAssessmentData;
      const csvData = [
        ['Field', 'Value'],
        ['Pharmacy Name', napraData.pharmacyName],
        ['Assessor Name', napraData.assessorName],
        ['Assessment Date', napraData.assessmentDate.toISOString().split('T')[0]],
        ['Preparation Name', napraData.preparationName],
        ['Ingredients', napraData.ingredients],
        ['Risk Level', napraData.riskLevel],
        ['Process Description', napraData.processDescription],
        ['Equipment Used', napraData.equipmentUsed],
        ['Environmental Controls', napraData.environmentalControls],
        ['Quality Control Measures', napraData.qualityControlMeasures],
        ['Packaging Materials', napraData.packagingMaterials],
        ['Storage Conditions', napraData.storageConditions],
        ['Mitigation Strategies', napraData.mitigationStrategies],
        ['Residual Risk', napraData.residualRisk]
      ];
      
      return csvData.map(row => 
        row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
      ).join('\n');
    }
  }

  static exportToJSON(assessment: RiskAssessmentData | KeswickAssessmentData): string {
    return JSON.stringify(assessment, null, 2);
  }

  static createShareableLink(assessment: RiskAssessmentData | KeswickAssessmentData, expiryHours = 24): string {
    const shareId = crypto.randomUUID();
    const shareableAssessment: ShareableAssessment = {
      id: shareId,
      data: assessment,
      expiresAt: new Date(Date.now() + expiryHours * 60 * 60 * 1000),
      createdAt: new Date()
    };

    try {
      const existingShares = this.getSharedAssessments();
      existingShares.push(shareableAssessment);
      localStorage.setItem(this.SHARE_STORAGE_KEY, JSON.stringify(existingShares));
      
      const baseUrl = window.location.origin;
      return `${baseUrl}/shared-assessment/${shareId}`;
    } catch (error) {
      console.error('Error creating shareable link:', error);
      throw new Error('Failed to create shareable link');
    }
  }

  static getSharedAssessment(shareId: string): ShareableAssessment | null {
    try {
      const shares = this.getSharedAssessments();
      const assessment = shares.find(share => share.id === shareId);
      
      if (!assessment) return null;
      
      // Check if expired
      if (new Date() > new Date(assessment.expiresAt)) {
        this.removeExpiredShares();
        return null;
      }
      
      return assessment;
    } catch (error) {
      console.error('Error retrieving shared assessment:', error);
      return null;
    }
  }

  private static getSharedAssessments(): ShareableAssessment[] {
    try {
      const stored = localStorage.getItem(this.SHARE_STORAGE_KEY);
      if (!stored) return [];
      
      return JSON.parse(stored).map((assessment: any) => ({
        ...assessment,
        expiresAt: new Date(assessment.expiresAt),
        createdAt: new Date(assessment.createdAt)
      }));
    } catch (error) {
      console.error('Error loading shared assessments:', error);
      return [];
    }
  }

  private static removeExpiredShares(): void {
    try {
      const shares = this.getSharedAssessments();
      const now = new Date();
      const validShares = shares.filter(share => now <= share.expiresAt);
      localStorage.setItem(this.SHARE_STORAGE_KEY, JSON.stringify(validShares));
    } catch (error) {
      console.error('Error removing expired shares:', error);
    }
  }

  static generateQRCodeData(url: string): string {
    // Simple QR code data URL - in production, you'd use a proper QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
  }

  static createEmailLink(assessment: RiskAssessmentData | KeswickAssessmentData, attachmentUrls?: string[]): string {
    const isKeswick = 'compoundName' in assessment;
    const compoundName = isKeswick ? (assessment as KeswickAssessmentData).compoundName : (assessment as RiskAssessmentData).preparationName;
    
    const subject = `NAPRA Risk Assessment: ${compoundName}`;
    const body = `Please find attached the NAPRA Risk Assessment for ${compoundName}.

Assessment Details:
- Compound: ${compoundName}
- Risk Level: ${isKeswick ? (assessment as KeswickAssessmentData).riskLevel : (assessment as RiskAssessmentData).riskLevel}
- Date: ${new Date().toLocaleDateString()}

This assessment was generated using the NAPRA Risk Assessment tool.

Best regards`;

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}
