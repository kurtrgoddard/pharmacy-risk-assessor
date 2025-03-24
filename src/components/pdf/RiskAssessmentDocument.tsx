
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
          <Text style={styles.heading}>Risk Assessment for {assessmentData.compoundName || 'Compound'}</Text>
          <Text style={styles.paragraph}>
            This document outlines the risk assessment for the compounding of {assessmentData.compoundName || 'Compound'},
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
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Active Ingredients</Text>
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
          <Text style={styles.subHeading}>Preparation Details</Text>
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
          <Text style={styles.subHeading}>Physical Characteristics</Text>
          {assessmentData.physicalCharacteristics && assessmentData.physicalCharacteristics.length > 0 ? 
            assessmentData.physicalCharacteristics.map((characteristic, index) => (
              <Text key={`char-${index}`} style={styles.listItem}>- {characteristic}</Text>
            )) : 
            <Text style={styles.listItem}>No physical characteristics specified</Text>
          }
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Equipment Required</Text>
          {assessmentData.equipmentRequired && assessmentData.equipmentRequired.length > 0 ? 
            assessmentData.equipmentRequired.map((equipment, index) => (
              <Text key={`equip-${index}`} style={styles.listItem}>- {equipment}</Text>
            )) : 
            <Text style={styles.listItem}>No equipment specified</Text>
          }
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Safety Checks</Text>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Workflow Considerations</Text>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Exposure Risks</Text>
          {assessmentData.exposureRisks && assessmentData.exposureRisks.length > 0 ? 
            assessmentData.exposureRisks.map((risk, index) => (
              <Text key={`risk-${index}`} style={styles.listItem}>- {risk}</Text>
            )) : 
            <Text style={styles.listItem}>No exposure risks specified</Text>
          }
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Personal Protective Equipment (PPE)</Text>
          <Text style={styles.paragraph}>Gloves: {assessmentData.ppe?.gloves || 'N/A'}</Text>
          <Text style={styles.paragraph}>Gown: {assessmentData.ppe?.gown || 'N/A'}</Text>
          <Text style={styles.paragraph}>Mask: {assessmentData.ppe?.mask || 'N/A'}</Text>
          <Text style={styles.paragraph}>Eye Protection Required: {assessmentData.ppe?.eyeProtection ? 'Yes' : 'No'}</Text>
          <Text style={styles.paragraph}>Other PPE: {assessmentData.ppe?.otherPPE && assessmentData.ppe.otherPPE.length > 0 ? assessmentData.ppe.otherPPE.join(', ') : 'None'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Safety Equipment</Text>
          <Text style={styles.paragraph}>Eye wash station: {assessmentData.safetyEquipment?.eyeWashStation ? 'Yes' : 'No'}</Text>
          <Text style={styles.paragraph}>Safety shower: {assessmentData.safetyEquipment?.safetyShower ? 'Yes' : 'No'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subHeading}>Risk Level</Text>
          <Text style={styles.paragraph}>Risk Level Assigned: {assessmentData.riskLevel || 'Not Assigned'}</Text>
          <Text style={styles.paragraph}>Rationale: {assessmentData.rationale || 'Not Provided'}</Text>
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
          Keswick Pharmacy • This document is intended for internal use only and should not be distributed without permission.
        </Text>
      </Page>
    </Document>
  );
};

export default RiskAssessmentDocument;
