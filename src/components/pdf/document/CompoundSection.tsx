
import React from "react";
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { KeswickAssessmentData } from "../../KeswickRiskAssessment";

interface CompoundSectionProps {
  assessmentData: KeswickAssessmentData;
  riskLevelStyle: any;
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2C3E50',
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
});

const CompoundSection: React.FC<CompoundSectionProps> = ({ assessmentData, riskLevelStyle }) => {
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.napraHeading}>NAPRA Compliant Risk Assessment</Text>
        <Text style={styles.heading}>{assessmentData.compoundName || 'Compound'}</Text>
        
        <View style={[styles.riskLevelBadge, riskLevelStyle]}>
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
    </>
  );
};

export default CompoundSection;
