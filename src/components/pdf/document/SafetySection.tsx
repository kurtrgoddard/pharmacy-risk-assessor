
import React from "react";
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { KeswickAssessmentData } from "../../KeswickRiskAssessment";

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
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
  listItem: {
    fontSize: 12,
    marginVertical: 2,
    color: '#546e7a',
  },
});

interface SafetySectionProps {
  assessmentData: KeswickAssessmentData;
}

const SafetySection: React.FC<SafetySectionProps> = ({ assessmentData }) => {
  return (
    <>
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
    </>
  );
};

export default SafetySection;
