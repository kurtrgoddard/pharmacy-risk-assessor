
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

interface PreparationSectionProps {
  assessmentData: KeswickAssessmentData;
}

const PreparationSection: React.FC<PreparationSectionProps> = ({ assessmentData }) => {
  return (
    <>
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
    </>
  );
};

export default PreparationSection;
