
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
  list: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 12,
    marginVertical: 2,
    color: '#546e7a',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#546e7a',
  },
});

interface IngredientsSectionProps {
  assessmentData: KeswickAssessmentData;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({ assessmentData }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>2. Risk Assessment Rationale</Text>
      <Text style={styles.paragraph}>{assessmentData.rationale || 'Not provided'}</Text>
      
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
  );
};

export default IngredientsSection;
