import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const CaseCard = ({ caseDetails, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(caseDetails)}>
      <Image source={{ uri: caseDetails.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {caseDetails.name} {caseDetails.surname}
        </Text>
        <Text style={styles.details}>Age: {caseDetails.age}</Text>
        <Text style={styles.details}>Province: {caseDetails.geoTarget}</Text>
        <Text style={styles.details}>Location: {caseDetails.lastSeen}</Text>
        <View style={[styles.status, { backgroundColor: caseDetails.status === 'ongoing' ? 'green' : '#4CAF50' }]}>
          <Text style={styles.statusText}>{caseDetails.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1f1f2e',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: 'gray',
    fontSize: 14,
  },
  status: {
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CaseCard;
``
