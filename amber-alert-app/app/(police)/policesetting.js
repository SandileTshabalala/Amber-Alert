import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {doc, getDoc} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons'; 
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../services/firebaseConfig';

const PoliceSettings = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(true);
  const [name, setName] = useState(''); 
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState(''); 
  const [badgeNumber, setbadgeNumber] = useState(''); 
  const [province, setProvince] = useState('');
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState();
  const navigation = useNavigation();

  const userId = FIREBASE_AUTH.currentUser?.uid;
  // Toggle functions for switches
  const toggleNotifications = () =>
    setIsNotificationsEnabled((previousState) => !previousState);
  const toggleDarkMode = () =>
    setIsDarkModeEnabled((previousState) => !previousState);
  const toggleLocation = async () => {
    const newValue = !isLocationEnabled;
    setIsLocationEnabled(newValue);
    await updatePreferences('location', newValue);
  };
  const toggleFingerprint = () =>
    setIsFingerprintEnabled((previousState) => !previousState);

    // Fetch user data from Firestore
    const fetchUserData = async () => {
      if (!userId) return;
  
      try {
        const userDocRef = doc(FIREBASE_DB, 'police_users', userId);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || '');
          setSurname(userData.surname || '');
          setEmail(userData.email || '');
          setbadgeNumber(userData.badgeNumber || '');
          setProvince(userData.province || '');
          setIsNotificationsEnabled(userData.preferences?.notifications || false);
          setIsDarkModeEnabled(userData.preferences?.darkMode || false);
          setIsLocationEnabled(userData.preferences?.location || false);
        } else {
          console.log('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchUserData();
    }, [userId]);

      // Update preferences
  const updatePreferences = async (key, value) => {
    if (!userId) return;

    try {
      const userDocRef = doc(FIREBASE_DB, 'police_users', userId);
      await updateDoc(userDocRef, {
        [`preferences.${key}`]: value,
      });
      console.log(`${key} preference updated to ${value}`);
    } catch (error) {
      console.error(`Error updating ${key} preference:`, error);
    }
  };

  // Handle logout function
  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      //navigation.replace('Login'); 
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
      console.error('Logout Error:', error);
    }
  };
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Settings</Text>
          <Ionicons name="settings-outline" size={28} color="white" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <Text style={styles.title}>Name & Surname:</Text>
          <Text style={styles.info}>{name} {surname}</Text>
          <Text style={styles.title}>Emaile:</Text>
          <Text style={styles.info}>{email}</Text>
          <Text style={styles.title}>badge Number:</Text>
          <Text style={styles.info}>{badgeNumber}</Text>
          <Text style={styles.title}>Department:</Text>
          <Text style={styles.info}>Kabokweni</Text>{/**department from db */}
          <Text style={styles.title}>Province:</Text>
          <Text style={styles.info}>{province}</Text>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Enable Fingerprint Login</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isFingerprintEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleFingerprint}
              value={isFingerprintEnabled}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Change Password</Text>
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => Alert.alert('Password Change', 'Feature coming soon!')}
            >
              <Text style={styles.changePasswordButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Enable Notifications</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isNotificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotifications}
              value={isNotificationsEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleDarkMode}
              value={isDarkModeEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutText}>Privacy Policy</Text>
            <Feather name="chevron-right" size={20} color="#EB6C24" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutText}>Terms of Service</Text>
            <Feather name="chevron-right" size={20} color="#EB6C24" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutText}>App Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#1f1f2e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  info: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    marginVertical: 5,
    color: '#aaa'
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingText: {
    fontSize: 16,
    color: 'white',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  aboutText: {
    fontSize: 16,
    color: 'white',
  },
  versionText: {
    fontSize: 16,
    color: '#aaa',
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
  changePasswordButton: {
    backgroundColor: '#EB6C24',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#EB6C24',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default PoliceSettings;
