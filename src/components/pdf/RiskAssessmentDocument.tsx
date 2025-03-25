
import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { KeswickAssessmentData } from "../KeswickRiskAssessment";

// Define document styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#ffffff',
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
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1pt solid #075985',
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 10,
    color: '#075985',
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
  signatureSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    borderTop: '1pt solid #546e7a',
    paddingTop: 5,
  },
  signatureText: {
    fontSize: 10,
    color: '#546e7a',
  },
  pharmacy: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075985',
  },
  currentDate: {
    fontSize: 10,
    color: '#075985',
    marginTop: 5,
  },
  confidentialWatermark: {
    position: 'absolute',
    color: '#E5E7EB',
    opacity: 0.2,
    fontSize: 60,
    transform: 'rotate(-45deg)',
    left: 170,
    top: 400,
  },
  napraHeading: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#075985',
  },
  riskLevelBadge: {
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'auto',
    alignSelf: 'flex-start',
  },
  riskLevelA: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  riskLevelB: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  riskLevelC: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  sectionTitle: {
    backgroundColor: '#f3f4f6',
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    color: '#1f2937',
  },
});

// Register font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ]
});

interface RiskAssessmentDocumentProps {
  assessmentData: KeswickAssessmentData;
}

const RiskAssessmentDocument: React.FC<RiskAssessmentDocumentProps> = ({ assessmentData }) => {
  const currentDate = new Date().toLocaleDateString();
  
  const getRiskLevelStyle = (riskLevel: string) => {
    switch (riskLevel) {
      case "Level A":
        return styles.riskLevelA;
      case "Level B":
        return styles.riskLevelB;
      case "Level C":
        return styles.riskLevelC;
      default:
        return styles.riskLevelA;
    }
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.confidentialWatermark}>CONFIDENTIAL</Text>
        
        {/* Header with Pharmacy information */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pharmacy}>Keswick Pharmacy</Text>
            <Text style={styles.headerText}>Professional Compounding Services</Text>
            <Text style={styles.headerText}>123 Main Street, Keswick, ON L4P 3C8</Text>
            <Text style={styles.headerText}>Tel: (905) 555-1234 • Fax: (905) 555-5678</Text>
          </View>
          <View>
            <Text style={styles.headerText}>Date: {currentDate}</Text>
            <Text style={styles.headerText}>DIN: {assessmentData.din || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.napraHeading}>NAPRA Compliant Risk Assessment</Text>
          <Text style={styles.heading}>{assessmentData.compoundName || 'Compound'}</Text>
          
          <View style={[styles.riskLevelBadge, getRiskLevelStyle(assessmentData.riskLevel)]}>
            <Text>Risk Level: {assessmentData.riskLevel}</Text>
          </View>
          
          <Text style={styles.paragraph}>
            This document provides a comprehensive risk assessment for the compounding of {assessmentData.compoundName || 'this compound'},
            in accordance with NAPRA standards and USP {'\u003C'}795{'\u003E'}/{'\u003C'}800{'\u003E'} guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Compound Identification</Text>
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
                <Text style={styles.tableCell}>{assessmentData.compoundName || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>DIN</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{assessmentData.din || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Risk Level</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{assessmentData.riskLevel}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Risk Assessment Rationale</Text>
          <Text style={styles.paragraph}>{assessmentData.rationale || 'Not provided'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Active Ingredients & Hazard Classification</Text>
          {assessmentData.activeIngredients && assessmentData.activeIngredients.length > 0 ? 
            assessmentData.activeIngredients.map((ingredient, index) => (
              <View key={`ingredient-${index}`} style={styles.list}>
                <Text style={styles.listItem}>
                  {ingredient.name || 'Unknown'} (Manufacturer: {ingredient.manufacturer || 'Unknown'})
                </Text>
                {ingredient.nioshStatus && ingredient.nioshStatus.isOnNioshList && (
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.listItem}>
                      NIOSH Listed: Yes (Table {ingredient.nioshStatus.table || 'Unknown'})
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
            )) : 
            <Text style={styles.listItem}>No active ingredients specified</Text>
          }
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Preparation Details</Text>
          <Text style={styles.paragraph}>
            Frequency of Preparation: {assessmentData.preparationDetails?.frequency || 'N/A'}
          </Text>
          <Text style={styles.paragraph}>
            Quantity Prepared (Average): {assessmentData.preparationDetails?.quantity || 'N/A'}
          </Text>
          <Text style={styles.paragraph}>
            Concentration presents health risk: {assessmentData.preparationDetails?.concentrationRisk ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Physical Characteristics & Equipment</Text>
          <Text style={styles.subHeading}>Physical Characteristics:</Text>
          {assessmentData.physicalCharacteristics && assessmentData.physicalCharacteristics.length > 0 ? 
            assessmentData.physicalCharacteristics.map((characteristic, index) => (
              <Text key={`char-${index}`} style={styles.listItem}>- {characteristic}</Text>
            )) : 
            <Text style={styles.listItem}>No physical characteristics specified</Text>
          }
          
          <Text style={styles.subHeading}>Equipment Required:</Text>
          {assessmentData.equipmentRequired && assessmentData.equipmentRequired.length > 0 ? 
            assessmentData.equipmentRequired.map((equipment, index) => (
              <Text key={`equip-${index}`} style={styles.listItem}>- {equipment}</Text>
            )) : 
            <Text style={styles.listItem}>No equipment specified</Text>
          }
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Safety Requirements (As per NAPRA Guidelines)</Text>
          <Text style={styles.subHeading}>Training and Procedural Requirements:</Text>
          <Text style={styles.paragraph}>
            Special education or competencies required: {assessmentData.safetyChecks?.specialEducation?.required ? 'Yes' : 'No'}
            {assessmentData.safetyChecks?.specialEducation?.required &&
              assessmentData.safetyChecks?.specialEducation?.description &&
              ` - ${assessmentData.safetyChecks.specialEducation.description}`
            }
          </Text>
          <Text style={styles.paragraph}>
            Visual verification required: {assessmentData.safetyChecks?.verificationRequired ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.paragraph}>
            Appropriate facilities/equipment available: {assessmentData.safetyChecks?.equipmentAvailable ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.paragraph}>
            Ventilation required: {assessmentData.safetyChecks?.ventilationRequired ? 'Yes' : 'No'}
          </Text>
          
          <Text style={styles.subHeading}>Workflow Considerations:</Text>
          <Text style={styles.paragraph}>
            Workflow uninterrupted: {assessmentData.workflowConsiderations?.uninterruptedWorkflow?.status ? 'Yes' : 'No'}
            {!assessmentData.workflowConsiderations?.uninterruptedWorkflow?.status &&
              assessmentData.workflowConsiderations?.uninterruptedWorkflow?.measures &&
              ` - Measures: ${assessmentData.workflowConsiderations.uninterruptedWorkflow.measures}`
            }
          </Text>
          <Text style={styles.paragraph}>
            Risk of microbial contamination: {assessmentData.workflowConsiderations?.microbialContaminationRisk ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.paragraph}>
            Risk of cross-contamination: {assessmentData.workflowConsiderations?.crossContaminationRisk ? 'Yes' : 'No'}
          </Text>

          <Text style={styles.subHeading}>Exposure Risks:</Text>
          {assessmentData.exposureRisks && assessmentData.exposureRisks.length > 0 ? 
            assessmentData.exposureRisks.map((risk, index) => (
              <Text key={`risk-${index}`} style={styles.listItem}>- {risk}</Text>
            )) : 
            <Text style={styles.listItem}>No exposure risks specified</Text>
          }
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Required Personal Protective Equipment (PPE)</Text>
          <Text style={styles.paragraph}>Gloves: {assessmentData.ppe?.gloves || 'N/A'}</Text>
          <Text style={styles.paragraph}>Gown: {assessmentData.ppe?.gown || 'N/A'}</Text>
          <Text style={styles.paragraph}>Mask: {assessmentData.ppe?.mask || 'N/A'}</Text>
          <Text style={styles.paragraph}>Eye Protection Required: {assessmentData.ppe?.eyeProtection ? 'Yes' : 'No'}</Text>
          <Text style={styles.paragraph}>Other PPE: {assessmentData.ppe?.otherPPE && assessmentData.ppe.otherPPE.length > 0 ? assessmentData.ppe.otherPPE.join(', ') : 'None'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Engineering Controls & Safety Equipment</Text>
          <Text style={styles.paragraph}>Eye wash station: {assessmentData.safetyEquipment?.eyeWashStation ? 'Required' : 'Not Required'}</Text>
          <Text style={styles.paragraph}>Safety shower: {assessmentData.safetyEquipment?.safetyShower ? 'Required' : 'Not Required'}</Text>
          <Text style={styles.paragraph}>
            {assessmentData.riskLevel === "Level C" ? 
              "Containment Primary Engineering Control (C-PEC) required. Dedicated room with negative pressure required." : 
              assessmentData.riskLevel === "Level B" ? 
                "Ventilated engineering control recommended. Segregated compounding area required." : 
                "Standard equipment adequate. Designated clean area required."
            }
          </Text>
        </View>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Prepared by (Technician):</Text>
            <Text style={[styles.signatureText, { marginTop: 15 }]}>Date:</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Verified by (Pharmacist):</Text>
            <Text style={[styles.signatureText, { marginTop: 15 }]}>Date:</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Keswick Pharmacy • This document is NAPRA-compliant and intended for internal use only.
        </Text>
      </Page>
    </Document>
  );
};

export default RiskAssessmentDocument;
