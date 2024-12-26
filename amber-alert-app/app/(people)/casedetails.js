import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '@/services/firebaseConfig';
import images from '@/constants/images';

const CaseDetails = () => {
  const route = useRoute();
  const { caseItem } = route.params;

  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReportSighting = async () => {
    if (!location || !notes) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(FIREBASE_DB, 'sightings'), {
        caseId: caseItem.id,
        location,
        notes,
        reportedAt: new Date(),
      });

      Alert.alert('Sighting Reported', 'Thank you for reporting the sighting.');
      setLocation('');
      setNotes('');
    } catch (error) {
      console.error('Error reporting sighting:', error);
      Alert.alert('Error', 'There was an issue reporting the sighting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Image source={images.casedetails} style={styles.headerImage} />
      <View style={styles.detailsContainer}>
        {/* Display the image if it exists */}
        {caseItem.image && (
          <Image source={{ uri: caseItem.image }} style={styles.caseImage} />
        )}
        <Text style={styles.title}>{caseItem.name} {caseItem.surname}</Text>
        <Text style={styles.age}>Age: {caseItem.age}</Text>
        <Text style={styles.lastSeen}>Last Seen: {caseItem.lastSeen}</Text>
        <Text style={styles.contactNumber}>Contact: {caseItem.contactNumber}</Text>
        <Text style={styles.description}>Description: {caseItem.description}</Text>
        {/* Conditional rendering of reward details */}
        {caseItem.reward && (
          <>
            <Text style={styles.reward}>Reward Amount: {caseItem.reward.amount}</Text>
            <Text style={styles.rewardDescription}>Reward Description: {caseItem.reward.description}</Text>
          </>
        )}

        <Text style={[styles.status, { color: caseItem.status === 'ongoing' ? 'red' : 'green' }]}>
          Status: {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
        </Text>

        <Text style={styles.location}>Province: {caseItem.geoTarget}</Text>
        <Text style={styles.date}>
          Created At: {new Date(caseItem.createdAt.seconds * 1000).toLocaleString()}
        </Text>

        {/* Sighting Report Form */}
        <TextInput
          style={styles.input}
          placeholder="Location of sighting"
          placeholderTextColor="#aaa"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Additional notes"
          placeholderTextColor="#aaa"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity
          style={[styles.reportButton, loading && styles.disabledButton]}
          onPress={handleReportSighting}
          disabled={loading}
        >
          <Text style={styles.reportButtonText}>
            {loading ? 'Reporting...' : 'Report Sighting'}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  headerImage: {
    width: '100%',
    height: 90,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  caseImage: {
    width: '100%',
    height: 220,
    top: -15,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  age: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 3,
  },
  lastSeen: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 3,
  },
  contactNumber: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 3,
  },
  reward: {
    fontSize: 16,
    color: '#EB6C24',
    marginBottom: 3,
  },
  rewardDescription: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 3,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 3,
  },
  status: {
    fontSize: 16,
    color: '#EB6C24',
    marginBottom: 3,
  },
  location: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 3,
  },
  date: {
    fontSize: 14,
    color: '#aaa',
  },
  input: {
    backgroundColor: '#2c2c3c',
    color: 'white',
    padding: 10,
    height:80,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 8,
  },
  reportButton: {
    backgroundColor: '#EB6C24',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:20
  },
  disabledButton: {
    opacity: 0.7,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CaseDetails;
