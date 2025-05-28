
import { z } from 'zod';

export const riskAssessmentSchema = z.object({
  pharmacyName: z.string().min(1, "Pharmacy name is required"),
  assessorName: z.string().min(1, "Assessor name is required"),
  assessmentDate: z.date(),
  preparationName: z.string().min(1, "Preparation name is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  processDescription: z.string().min(1, "Process description is required"),
  equipmentUsed: z.string().min(1, "Equipment information is required"),
  environmentalControls: z.string().min(1, "Environmental controls are required"),
  stabilityData: z.string().optional(),
  sterilizationMethods: z.string().optional(),
  qualityControlMeasures: z.string().min(1, "Quality control measures are required"),
  packagingMaterials: z.string().min(1, "Packaging materials are required"),
  labelingPractices: z.string().min(1, "Labeling practices are required"),
  storageConditions: z.string().min(1, "Storage conditions are required"),
  riskLevel: z.enum(["low", "medium", "high"]),
  mitigationStrategies: z.string().min(1, "Mitigation strategies are required"),
  residualRisk: z.string().min(1, "Residual risk assessment is required"),
  references: z.string().optional(),
  // Additional fields for compatibility
  compoundName: z.string().optional(),
  batchSize: z.string().optional(),
  dosageForm: z.string().optional(),
  hazardClassification: z.object({
    ghs: z.array(z.string()).optional()
  }).optional(),
  recommendedPPE: z.object({
    gloves: z.string().optional(),
    eyeProtection: z.string().optional(),
    respiratoryProtection: z.string().optional(),
    bodyProtection: z.string().optional()
  }).optional()
});

export type RiskAssessmentData = z.infer<typeof riskAssessmentSchema>;
