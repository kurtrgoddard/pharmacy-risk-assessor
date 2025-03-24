import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Define document styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Open Sans',
    fontSize: 12,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2C3E50',
  },
  subHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#34495e',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#546e7a',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    margin: 4,
    fontSize: 12,
    fontWeight: 'bold'
  },
  tableCell: {
    margin: 4,
    fontSize: 10
  },
  logo: {
    width: 80,
    height: 24,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  list: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 12,
    marginVertical: 2,
    color: '#546e7a',
  },
});

// Register font (make sure the font file is accessible)
Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0bf8pkAp6a.ttf' // Replace with the actual path to your font file
});

export interface ActiveIngredient {
  name: string;
  manufacturer: string;
  nioshStatus: {
    isOnNioshList: boolean;
    table?: string;
    hazardLevel?: "High Hazard" | "Moderate Hazard" | "Non-Hazardous";
    hazardType?: string[];
  };
  reproductiveToxicity: boolean;
  whmisHazards: boolean;
  sdsDescription: string;
  monographWarnings: string;
}

export interface KeswickAssessmentData {
  compoundName: string;
  din: string;
  activeIngredients: ActiveIngredient[];
  preparationDetails: {
    frequency: string;
    quantity: string;
    concentrationRisk: boolean;
  };
  physicalCharacteristics: string[];
  equipmentRequired: string[];
  safetyChecks: {
    specialEducation: {
      required: boolean;
      description?: string;
    };
    verificationRequired: boolean;
    equipmentAvailable: boolean;
    ventilationRequired: boolean;
  };
  workflowConsiderations: {
    uninterruptedWorkflow: {
      status: boolean;
      measures?: string;
    };
    microbialContaminationRisk: boolean;
    crossContaminationRisk: boolean;
  };
  exposureRisks: string[];
  ppe: {
    gloves: string;
    gown: string;
    mask: string;
    eyeProtection: boolean;
    otherPPE: string[];
  };
  safetyEquipment: {
    eyeWashStation: boolean;
    safetyShower: boolean;
  };
  riskLevel: string;
  rationale: string;
}

interface KeswickRiskAssessmentProps {
  assessmentData: KeswickAssessmentData;
  fileName: string;
  onStartOver: () => void;
}

const KeswickRiskAssessment: React.FC<KeswickRiskAssessmentProps> = ({
  assessmentData,
  fileName,
  onStartOver,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 assessment-appear">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-pharmacy-darkBlue mb-2">
          Risk Assessment Document
        </h2>
        <p className="text-pharmacy-gray">
          Here is your generated risk assessment document.
        </p>
      </div>
      
      <PDFViewerDocument assessmentData={assessmentData} fileName={fileName} />

      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex items-center text-pharmacy-darkBlue hover:text-pharmacy-blue transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

interface PDFViewerDocumentProps {
  assessmentData: KeswickAssessmentData;
  fileName: string;
}

const PDFViewerDocument: React.FC<PDFViewerDocumentProps> = ({ assessmentData, fileName }) => {
  return (
    <PDFViewer
      width="100%"
      height={600}
      style={{ 
        display: "flex", 
        flexDirection: "column" 
      }}
      className="border border-gray-300 rounded-md shadow-sm"
    >
      <RiskAssessmentDocument assessmentData={assessmentData} />
    </PDFViewer>
  );
};

interface RiskAssessmentDocumentProps {
  assessmentData: KeswickAssessmentData;
}

const RiskAssessmentDocument: React.FC<RiskAssessmentDocumentProps> = ({ assessmentData }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          {/* Replace with actual logo */}
          {/* <Image style={styles.logo} src="/images/keswick_logo.png" /> */}
          <Text style={styles.heading}>Risk Assessment for {assessmentData.compoundName}</Text>
          <Text style={styles.paragraph}>
            This document outlines the risk assessment for the compounding of {assessmentData.compoundName},
            in accordance with NAPRA and USP {'\u003C'}795{'\u003E'}/{'\u003C'}800{'\u003E'} guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Compound Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Detail</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Information</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Compound Name</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{assessmentData.compoundName}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>DIN</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{assessmentData.din}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Active Ingredients</Text>
          {assessmentData.activeIngredients.map((ingredient, index) => (
            <View key={index} style={styles.list}>
              <Text style={styles.listItem}>
                {ingredient.name} (Manufacturer: {ingredient.manufacturer})
              </Text>
              {ingredient.nioshStatus.isOnNioshList && (
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.listItem}>
                    NIOSH Listed: Yes (Table {ingredient.nioshStatus.table})
                  </Text>
                  {ingredient.nioshStatus.hazardType && ingredient.nioshStatus.hazardType.length > 0 && (
                    <Text style={styles.listItem}>
                      Hazards: {ingredient.nioshStatus.hazardType.join(', ')}
                    </Text>
                  )}
                </View>
              )}
              {ingredient.reproductiveToxicity && (
                <Text style={styles.listItem}>
                  Toxic to Reproduction: Yes
                </Text>
              )}
              {ingredient.whmisHazards && (
                <Text style={styles.listItem}>
                  WHMIS Health Hazards: Yes
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Preparation Details</Text>
          <Text style={styles.paragraph}>
            Frequency of Preparation: {assessmentData.preparationDetails.frequency}
          </Text>
          <Text style={styles.paragraph}>
            Quantity Prepared (Average): {assessmentData.preparationDetails.quantity}
          </Text>
          <Text style={styles.paragraph}>
            Concentration presents health risk: {assessmentData.preparationDetails.concentrationRisk ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Physical Characteristics</Text>
          {assessmentData.physicalCharacteristics.map((characteristic, index) => (
            <Text key={index} style={styles.listItem}>- {characteristic}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Equipment Required</Text>
          {assessmentData.equipmentRequired.map((equipment, index) => (
            <Text key={index} style={styles.listItem}>- {equipment}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Safety Checks</Text>
          <Text style={styles.paragraph}>
            Special education or competencies required: {assessmentData.safetyChecks.specialEducation.required ? 'Yes' : 'No'}
            {assessmentData.safetyChecks.specialEducation.required &&
              ` - ${assessmentData.safetyChecks.specialEducation.description}`
            }
          </Text>
          <Text style={styles.paragraph}>
            Visual verification required: {assessmentData.safetyChecks.verificationRequired ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.paragraph}>
            Appropriate facilities/equipment available: {assessmentData.safetyChecks.equipmentAvailable ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.paragraph}>
            Ventilation required: {assessmentData.safetyChecks.ventilationRequired ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Workflow Considerations</Text>
          <Text style={styles.paragraph}>
            Workflow uninterrupted: {assessmentData.workflowConsiderations.uninterruptedWorkflow.status ? 'Yes' : 'No'}
            {!assessmentData.workflowConsiderations.uninterruptedWorkflow.status &&
              ` - Measures: ${assessmentData.workflowConsiderations.uninterruptedWorkflow.measures}`
            }
          </Text>
          <Text style={styles.paragraph}>
            Risk of microbial contamination: {assessmentData.workflowConsiderations.microbialContaminationRisk ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.paragraph}>
            Risk of cross-contamination: {assessmentData.workflowConsiderations.crossContaminationRisk ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Exposure Risks</Text>
          {assessmentData.exposureRisks.map((risk, index) => (
            <Text key={index} style={styles.listItem}>- {risk}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Personal Protective Equipment (PPE)</Text>
          <Text style={styles.paragraph}>Gloves: {assessmentData.ppe.gloves}</Text>
          <Text style={styles.paragraph}>Gown: {assessmentData.ppe.gown}</Text>
          <Text style={styles.paragraph}>Mask: {assessmentData.ppe.mask}</Text>
          <Text style={styles.paragraph}>Eye Protection Required: {assessmentData.ppe.eyeProtection ? 'Yes' : 'No'}</Text>
          <Text style={styles.paragraph}>Other PPE: {assessmentData.ppe.otherPPE.join(', ')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Safety Equipment</Text>
          <Text style={styles.paragraph}>Eye wash station: {assessmentData.safetyEquipment.eyeWashStation ? 'Yes' : 'No'}</Text>
          <Text style={styles.paragraph}>Safety shower: {assessmentData.safetyEquipment.safetyShower ? 'Yes' : 'No'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Risk Level</Text>
          <Text style={styles.paragraph}>Risk Level Assigned: {assessmentData.riskLevel}</Text>
          <Text style={styles.paragraph}>Rationale: {assessmentData.rationale}</Text>
        </View>

        <Text style={styles.footer}>
          This document is intended for internal use only and should not be distributed without permission.
        </Text>
      </Page>
    </Document>
  );
};

export default KeswickRiskAssessment;
