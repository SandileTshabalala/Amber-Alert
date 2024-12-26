import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../services/firebaseConfig';
import images from '@/constants/images';

const PeopleProfile = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [province, setProvince] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const userId = FIREBASE_AUTH.currentUser?.uid;

  const fetchUserData = async () => {
    if (!userId) return;

    try {
      const userDocRef = doc(FIREBASE_DB, 'public_users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || '');
        setSurname(userData.surname || '');
        setEmail(userData.email || '');
        setContactNumber(userData.contactNumber || '');
        setProvince(userData.province || '');
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

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.replace('sign-in');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
      console.error('Logout Error:', error);
    }
  };

  const handleEditProfile = async () => {
    if (!userId) return;

    try {
      const userDocRef = doc(FIREBASE_DB, 'public_users', userId);
      await updateDoc(userDocRef, {
        name,
        surname,
        email,
        contactNumber,
        province,
      });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Profile Update Error:', error);
    }
  };

  const getInitials = (name, surname) => {
    const firstInitial = name ? name[0] : '';
    const lastInitial = surname ? surname[0] : '';
    return firstInitial + lastInitial;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EB6C24" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={images.useravatar} />
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>
                {getInitials(name, surname)}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{name} {surname}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <Text style={styles.Title}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#888"
          />
          <Text style={styles.Title}>Surname</Text>
          <TextInput
            style={styles.input}
            value={surname}
            onChangeText={setSurname}
            placeholder="Enter your surname"
            placeholderTextColor="#888"
          />
          <Text style={styles.Title}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          <Text style={styles.Title}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="Enter your phone number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
          />
          <Text style={styles.Title}>Province</Text>
          <TextInput
            style={styles.input}
            value={province}
            onChangeText={setProvince}
            placeholder="Enter Province"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Notification Settings</Text>
            <Feather name="chevron-right" size={20} color="#EB6C24" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Privacy Settings</Text>
            <Feather name="chevron-right" size={20} color="#EB6C24" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Help Center</Text>
            <Feather name="chevron-right" size={20} color="#EB6C24" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Contact Us</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161622',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    backgroundColor: '#EB6C24',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  email: {
    fontSize: 16,
    color: '#aaa',
  },
  section: {
    backgroundColor: '#1f1f2e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  Title: {
    color: '#aaa',
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1f1f2e',
    color: 'white',
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

export default PeopleProfile;
