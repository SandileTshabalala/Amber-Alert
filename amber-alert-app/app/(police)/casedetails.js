import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../services/firebaseConfig';
import CustomField from '../../components/customfield';
import CustomButton from '../../components/customebutton1';
import images from '@/constants/images';

const CaseDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { caseItem } = route.params;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(caseItem.name);
  const [surname, setSurname] = useState(caseItem.surname);
  const [age, setAge] = useState(caseItem.age);
  const [lastSeen, setLastSeen] = useState(caseItem.lastSeen);
  const [contactNumber, setContactNumber] = useState(caseItem.contactNumber);
  const [reward, setReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(
    caseItem.reward ? caseItem.reward.amount : ''
  );
  const [rewardDescription, setRewardDescription] = useState(
    caseItem.reward ? caseItem.reward.description : ''
  );
  const [description, setDescription] = useState(caseItem.description);
  const [status, setStatus] = useState(caseItem.status || 'ongoing');

  const db = FIREBASE_DB;

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'alerts', caseItem.id), {
        name,
        surname,
        age,
        lastSeen,
        contactNumber,
        reward: rewardAmount
          ? { amount: rewardAmount, description: rewardDescription }
          : null,
        description,
        status,
      });
      Alert.alert('Success', 'Case updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating case:', error);
      Alert.alert('Error', 'Failed to update case. Please try again.');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this case?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'alerts', caseItem.id));
              Alert.alert('Success', 'Case deleted successfully!');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting case:', error);
              Alert.alert('Error', 'Failed to delete case. Please try again.');
            }
          },
        },
      ]
    );
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

          {editing ? (
            <>
              <CustomField
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
              />
              <CustomField
                value={surname}
                onChangeText={setSurname}
                placeholder="Enter surname"
              />
              <CustomField
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="Enter age"
              />
              <CustomField
                value={lastSeen}
                onChangeText={setLastSeen}
                placeholder="Enter last seen location"
              />
              <CustomField
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
                placeholder="Enter contact number"
              />

              {/* Reward Selection */}
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Reward Offered</Text>
                <Picker
                  selectedValue={reward ? 'true' : 'false'}
                  onValueChange={(itemValue) => setReward(itemValue === 'true')}
                  style={styles.picker}
                >
                  <Picker.Item label="No" value="false" />
                  <Picker.Item label="Yes" value="true" />
                </Picker>
              </View>

              {/* Conditionally Render Reward Details */}
              {reward && (
                <View style={styles.rewardDetails}>
                  <CustomField
                    value={rewardAmount}
                    onChangeText={setRewardAmount}
                    keyboardType="numeric"
                    placeholder="Enter reward amount"
                  />

                  <CustomField
                    value={rewardDescription}
                    onChangeText={setRewardDescription}
                    multiline
                    placeholder="Enter reward description"
                  />
                </View>
              )}

              <CustomField
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="Enter description"
              />
            {/* Status Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Status</Text>
              <Picker
                selectedValue={status} // Corrected status logic
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Resolved" value="resolved" />
                <Picker.Item label="Ongoing" value="ongoing" />
              </Picker>
            </View>
              <CustomButton
                onPress={handleUpdate}
                title="Save Changes"
                style={styles.updateButton}
              />
              <CustomButton
                onPress={() => setEditing(false)}
                title="Cancel"
                style={styles.cancelButton}
              />
            </>
          ) : (
            <>
              <Text style={styles.title}>
                {caseItem.name} {caseItem.surname}
              </Text>
              <Text style={styles.age}>Age: {caseItem.age}</Text>
              <Text style={styles.lastSeen}>
                Last Seen: {caseItem.lastSeen}
              </Text>
              <Text style={styles.contactNumber}>
                Contact: {caseItem.contactNumber}
              </Text>
              <Text style={styles.description}>
                Description: {caseItem.description}
              </Text>

              {/* Conditional rendering of reward details */}
              {caseItem.reward && (
                <>
                  <Text style={styles.reward}>
                    Reward Amount:R{caseItem.reward.amount}
                  </Text>
                  <Text style={styles.rewardDescription}>
                    Reward Description: {caseItem.reward.description}
                  </Text>
                </>
              )}
            <Text style={[styles.status, { color: status === 'ongoing' ? 'red' : 'green' }]}>
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
              <Text style={styles.location}>
                Location: {caseItem.geoTarget}
              </Text>
              <Text style={styles.date}>
                Created At:{' '}
                {new Date(caseItem.createdAt.seconds * 1000).toLocaleString()}
              </Text>

              <CustomButton
                onPress={() => setEditing(true)}
                title="Edit Case"
                style={styles.editButton}
              />
              <CustomButton
                onPress={handleDelete}
                title="Delete Case"
                style={styles.deleteButton}
              />
            </>
          )}
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
    height: 200,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  caseImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
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
  pickerContainer: {
    backgroundColor: '#1f1f2e',
    borderRadius: 10,
    marginBottom: 10,
  },
  pickerLabel: {
    color: '#aaa',
    paddingLeft: 15,
    paddingTop: 15,
  },
  picker: {
    color: 'white',
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
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#4A90E2',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF5C5C',
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF5C5C',
    marginBottom: 10,
  },
});

export default CaseDetails;
