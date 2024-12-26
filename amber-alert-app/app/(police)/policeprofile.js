import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomField from '../../components/customfield';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../services/firebaseConfig';
import images from '@/constants/images'; 
const PoliceProfile = () => {
  const [name, setName] = useState('Officer name &surname');
  const [badgeNumber, setBadgeNumber] = useState('123456');
  const [station, setStation] = useState('Kabokweni Police Station');
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      //navigation.replace('Login'); // Navigate back to the Login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
      console.error('Logout Error:', error);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Feature coming soon!');
  };

  const handleViewAlerts = () => {
   // navigation.navigate('MyAlerts'); // Navigate to a screen showing alerts created by the officer
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileHeader}>
          <Image
            style={styles.avatar}
            source={images.policeofficeravatar} 
          />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.badge}>Badge Number: {badgeNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <CustomField
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <CustomField
            value={badgeNumber}
            onChangeText={setBadgeNumber}
            placeholder="Enter your badge number"
            keyboardType="numeric"
          />
          <CustomField
            value={station}
            onChangeText={setStation}
            placeholder="Enter your assigned station"
          />
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.actionItem} onPress={handleViewAlerts}>
            <Text style={styles.actionText}>View My Alerts</Text>
            <Feather name="chevron-right" size={20} color="#EB6C24" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <Text style={styles.actionText}>Logout</Text>
            <Feather name="log-out" size={20} color="#EB6C24" />
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
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  badge: {
    fontSize: 16,
    color: '#aaa',
  },
  section: {
    backgroundColor: '#1f1f2e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#EB6C24',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionText: {
    fontSize: 16,
    color: 'white',
  },
});
export default PoliceProfile;

