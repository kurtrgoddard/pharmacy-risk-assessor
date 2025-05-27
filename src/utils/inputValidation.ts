
import { z } from 'zod';

// Validation schemas for different data types
export const compoundNameSchema = z.string()
  .min(1, "Compound name is required")
  .max(200, "Compound name must be less than 200 characters")
  .regex(/^[a-zA-Z0-9\s\-\(\)\[\]\/\.,]+$/, "Compound name contains invalid characters");

export const dinSchema = z.string()
  .max(50, "DIN must be less than 50 characters")
  .regex(/^[a-zA-Z0-9\s\-\/]*$/, "DIN contains invalid characters");

export const ingredientNameSchema = z.string()
  .min(1, "Ingredient name is required")
  .max(100, "Ingredient name must be less than 100 characters")
  .regex(/^[a-zA-Z0-9\s\-\(\)\[\]\/\.,]+$/, "Ingredient name contains invalid characters");

export const manufacturerSchema = z.string()
  .max(100, "Manufacturer name must be less than 100 characters")
  .regex(/^[a-zA-Z0-9\s\-\.\,]*$/, "Manufacturer name contains invalid characters");

export const quantitySchema = z.string()
  .max(50, "Quantity must be less than 50 characters")
  .regex(/^[a-zA-Z0-9\s\-\.\,\/]*$/, "Quantity contains invalid characters");

export const textFieldSchema = z.string()
  .max(1000, "Text field must be less than 1000 characters")
  .regex(/^[a-zA-Z0-9\s\-\.\,\(\)\[\]\/\n\r]*$/, "Text contains invalid characters");

export const riskLevelSchema = z.enum(["Level A", "Level B", "Level C", "A", "B", "C", ""]);

export const frequencySchema = z.enum(["daily", "weekly", "monthly", "rarely", "As needed", "Daily", "Weekly", "Monthly", "Rarely"]);

// Compound assessment validation schema
export const compoundAssessmentSchema = z.object({
  compoundName: compoundNameSchema,
  din: dinSchema,
  activeIngredients: z.array(z.object({
    name: ingredientNameSchema,
    manufacturer: manufacturerSchema.optional(),
    nioshStatus: z.object({
      isOnNioshList: z.boolean(),
      hazardLevel: z.string(),
      hazardType: z.array(z.string())
    }),
    reproductiveToxicity: z.boolean(),
    whmisHazards: z.boolean(),
    sdsDescription: textFieldSchema.optional(),
    monographWarnings: textFieldSchema.optional()
  })),
  preparationDetails: z.object({
    frequency: frequencySchema,
    quantity: quantitySchema,
    concentrationRisk: z.boolean()
  }),
  physicalCharacteristics: z.array(z.string()),
  equipmentRequired: z.array(z.string()),
  exposureRisks: z.array(z.string()),
  riskLevel: riskLevelSchema,
  rationale: textFieldSchema
});

// NAPRA assessment validation schema
export const napraAssessmentSchema = z.object({
  compoundName: compoundNameSchema,
  din: dinSchema,
  compoundingType: z.enum(["Sterile", "Non-Sterile", ""]),
  assignedRiskLevel: riskLevelSchema,
  recommendedControls: z.object({
    ppe: z.array(z.string()),
    engineeringControls: z.array(z.string()),
    otherControls: z.array(z.string())
  })
});

// Sanitization functions
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>'"&]/g, '') // Remove potential XSS characters
    .substring(0, 1000); // Limit length
};

export const sanitizeArray = (input: any[]): string[] => {
  if (!Array.isArray(input)) return [];
  
  return input
    .filter(item => typeof item === 'string')
    .map(sanitizeString)
    .filter(item => item.length > 0)
    .slice(0, 50); // Limit array size
};

export const sanitizeObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return {};
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Validation function with detailed error logging
export const validateInput = <T>(schema: z.ZodSchema<T>, data: any, context: string): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error(`Validation error in ${context}:`, error);
    
    if (error instanceof z.ZodError) {
      const userFriendlyErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      throw new Error(`Invalid input: ${userFriendlyErrors}`);
    }
    
    throw new Error('Invalid input provided');
  }
};
