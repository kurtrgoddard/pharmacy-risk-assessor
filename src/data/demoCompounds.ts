
import { KeswickAssessmentData } from '@/components/KeswickRiskAssessment';

export interface DemoCompound {
  id: string;
  name: string;
  description: string;
  riskLevel: 'A' | 'B' | 'C';
  assessmentData: KeswickAssessmentData;
}

export const demoCompounds: DemoCompound[] = [
  {
    id: 'simple',
    name: 'Hydrocortisone Cream',
    description: 'Simple topical preparation - Level A risk',
    riskLevel: 'A',
    assessmentData: {
      compoundName: "Hydrocortisone 1% Cream",
      din: "N/A (Compounded product)",
      activeIngredients: [
        {
          name: "Hydrocortisone",
          manufacturer: "Various",
          nioshStatus: {
            isOnNioshList: false,
            hazardLevel: "Non-Hazardous",
            hazardType: []
          },
          reproductiveToxicity: false,
          whmisHazards: false,
          sdsDescription: "Mild topical corticosteroid with low systemic absorption",
          monographWarnings: "Avoid prolonged use on large areas"
        }
      ],
      preparationDetails: {
        frequency: "Daily",
        quantity: "50g",
        concentrationRisk: false
      },
      physicalCharacteristics: ["Cream/Ointment"],
      equipmentRequired: ["Balance", "Spatula"],
      safetyChecks: {
        specialEducation: {
          required: false,
          description: ""
        },
        verificationRequired: true,
        equipmentAvailable: true,
        ventilationRequired: false
      },
      workflowConsiderations: {
        uninterruptedWorkflow: {
          status: true,
          measures: "Standard workflow procedures"
        },
        microbialContaminationRisk: false,
        crossContaminationRisk: false
      },
      exposureRisks: ["Skin"],
      ppe: {
        gloves: "Regular",
        gown: "Designated Compounding Jacket",
        mask: "Surgical mask",
        eyeProtection: false,
        otherPPE: []
      },
      safetyEquipment: {
        eyeWashStation: true,
        safetyShower: false,
        powderContainmentHood: false,
        localExhaustVentilation: false
      },
      riskLevel: "Level A",
      rationale: "This simple topical preparation involves non-hazardous ingredients in a cream base. Standard Level A precautions with basic PPE and routine safety measures are sufficient for safe compounding according to NAPRA guidelines."
    }
  },
  {
    id: 'moderate',
    name: 'Tretinoin Gel',
    description: 'Moderate complexity preparation - Level B risk',
    riskLevel: 'B',
    assessmentData: {
      compoundName: "Tretinoin 0.05% Gel",
      din: "N/A (Compounded product)",
      activeIngredients: [
        {
          name: "Tretinoin",
          manufacturer: "Various",
          nioshStatus: {
            isOnNioshList: false,
            hazardLevel: "Non-Hazardous",
            hazardType: []
          },
          reproductiveToxicity: true,
          whmisHazards: true,
          sdsDescription: "Retinoid with teratogenic potential; skin and eye irritant",
          monographWarnings: "Contraindicated in pregnancy; avoid sun exposure"
        }
      ],
      preparationDetails: {
        frequency: "As needed",
        quantity: "30g",
        concentrationRisk: true
      },
      physicalCharacteristics: ["Semi-Solid", "Light-sensitive"],
      equipmentRequired: ["Balance", "Mixing equipment", "Light-protective containers"],
      safetyChecks: {
        specialEducation: {
          required: true,
          description: "Training on handling teratogenic substances"
        },
        verificationRequired: true,
        equipmentAvailable: true,
        ventilationRequired: true
      },
      workflowConsiderations: {
        uninterruptedWorkflow: {
          status: true,
          measures: "Dedicated compounding session to prevent cross-contamination"
        },
        microbialContaminationRisk: false,
        crossContaminationRisk: true
      },
      exposureRisks: ["Skin", "Eyes"],
      ppe: {
        gloves: "Chemotherapy-rated",
        gown: "Designated Compounding Jacket",
        mask: "N95 Respirator",
        eyeProtection: true,
        otherPPE: ["Hair cover"]
      },
      safetyEquipment: {
        eyeWashStation: true,
        safetyShower: false,
        powderContainmentHood: false,
        localExhaustVentilation: true
      },
      riskLevel: "Level B",
      rationale: "Tretinoin has reproductive toxicity concerns and requires enhanced safety precautions. The compound's teratogenic potential and skin/eye irritation properties necessitate Level B containment strategies including specialized PPE and ventilation according to NAPRA guidelines."
    }
  },
  {
    id: 'complex',
    name: 'Methotrexate Solution',
    description: 'Complex hazardous preparation - Level C risk',
    riskLevel: 'C',
    assessmentData: {
      compoundName: "Methotrexate 25mg/mL Injection Solution",
      din: "N/A (Compounded product)",
      activeIngredients: [
        {
          name: "Methotrexate",
          manufacturer: "Various",
          nioshStatus: {
            isOnNioshList: true,
            hazardLevel: "Hazardous",
            hazardType: ["Carcinogenic", "Reproductive toxicity", "Developmental toxicity"]
          },
          reproductiveToxicity: true,
          whmisHazards: true,
          sdsDescription: "Cytotoxic antineoplastic agent; carcinogenic and teratogenic",
          monographWarnings: "Handle as hazardous drug; requires specialized disposal"
        }
      ],
      preparationDetails: {
        frequency: "On demand",
        quantity: "10mL vial",
        concentrationRisk: true
      },
      physicalCharacteristics: ["Liquid", "Cytotoxic"],
      equipmentRequired: ["Biological Safety Cabinet", "Closed system transfer devices", "Precision balance"],
      safetyChecks: {
        specialEducation: {
          required: true,
          description: "Cytotoxic drug handling certification required"
        },
        verificationRequired: true,
        equipmentAvailable: true,
        ventilationRequired: true
      },
      workflowConsiderations: {
        uninterruptedWorkflow: {
          status: true,
          measures: "Dedicated cytotoxic compounding area with restricted access"
        },
        microbialContaminationRisk: false,
        crossContaminationRisk: true
      },
      exposureRisks: ["Skin", "Inhalation", "Eyes", "Ingestion"],
      ppe: {
        gloves: "Double chemotherapy-rated",
        gown: "Chemotherapy gown",
        mask: "N95 Respirator",
        eyeProtection: true,
        otherPPE: ["Hair cover", "Shoe covers", "Face shield"]
      },
      safetyEquipment: {
        eyeWashStation: true,
        safetyShower: true,
        powderContainmentHood: false,
        localExhaustVentilation: true
      },
      riskLevel: "Level C",
      rationale: "Methotrexate is classified as a hazardous drug by NIOSH with carcinogenic and reproductive toxicity properties. This cytotoxic agent requires the highest level of containment (Level C) including biological safety cabinets, specialized PPE, and hazardous waste disposal protocols according to NAPRA and USP <800> guidelines."
    }
  }
];

export const getDemoCompound = (id: string): DemoCompound | undefined => {
  return demoCompounds.find(compound => compound.id === id);
};
