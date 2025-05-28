
import React from "react";
import { Text, View, StyleSheet } from '@react-pdf/renderer';

interface HeaderSectionProps {
  pharmacyName: string;
  address: string;
  currentDate: string;
  din: string;
}

const styles = StyleSheet.create({
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
  pharmacy: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075985',
  },
});

const HeaderSection: React.FC<HeaderSectionProps> = ({ pharmacyName, address, currentDate, din }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.pharmacy}>{pharmacyName}</Text>
        <Text style={styles.headerText}>Professional Compounding Services</Text>
        <Text style={styles.headerText}>{address || "123 Main Street, Keswick, ON L4P 3C8"}</Text>
        <Text style={styles.headerText}>Tel: (905) 555-1234 • Fax: (905) 555-5678</Text>
      </View>
      <View>
        <Text style={styles.headerText}>Date: {currentDate}</Text>
        <Text style={styles.headerText}>DIN: {din || 'N/A'}</Text>
      </View>
    </View>
  );
};

export default HeaderSection;
