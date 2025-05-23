
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
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#546e7a',
  },
});

interface PPESectionProps {
  assessmentData: KeswickAssessmentData;
}

const PPESection: React.FC<PPESectionProps> = ({ assessmentData }) => {
  return (
    <>
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
    </>
  );
};

export default PPESection;
