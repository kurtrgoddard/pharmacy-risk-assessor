
import React from "react";
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
  footer: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

interface SignatureSectionProps {
  pharmacyName: string;
  pharmacistName?: string;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ pharmacyName, pharmacistName }) => {
  return (
    <>
      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureText}>Prepared by (Technician):</Text>
          <Text style={[styles.signatureText, { marginTop: 15 }]}>Date:</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureText}>Verified by (Pharmacist):</Text>
          {pharmacistName && (
            <Text style={[styles.signatureText, { marginTop: 5 }]}>{pharmacistName}</Text>
          )}
          <Text style={[styles.signatureText, { marginTop: 15 }]}>Date:</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        {pharmacyName} • This document is NAPRA-compliant and intended for internal use only.
      </Text>
    </>
  );
};

export default SignatureSection;
