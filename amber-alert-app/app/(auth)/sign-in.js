import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, signInWithCustomToken } from 'firebase/auth';
import { collection, query, where, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../services/firebaseConfig';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../constants/images';
import CustomField from '@/components/customfield';
import CustomButton from '@/components/CustomButton';

const onPeople = () => { router.push('/peoplehome') }
const onPolice = () => { router.push('/policehome') }

const SignIn = () => {
  const [role, setRole] = useState('public');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (role === 'public') {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/peoplehome')
        
      }  else if (role === 'police') {
        const response = await fetch('http://localhost:3000/generateCustomToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ badgeNumber }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          await signInWithCustomToken(auth, data.token);
          router.push('/policehome');
        } else {
          throw new Error('Invalid badge number or password');
        }
      }
      alert('User signed in successfully!');
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={[styles.innerContainer, { minHeight: Dimensions.get('window').height - 100 }]}>
          <Image style={styles.logo} source={images.logo} resizeMode={'contain'} />
          <Text style={styles.title}>Sign In As</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'public' && styles.selectedButton]}
              onPress={() => setRole('public')}
            >
              <Text style={[styles.buttonText, role === 'public' && styles.selectedButtonText]}>Public Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'police' && styles.selectedButton]}
              onPress={() => setRole('police')}
            >
              <Text style={[styles.buttonText, role === 'police' && styles.selectedButtonText]}>Police Login</Text>
            </TouchableOpacity>
          </View>

          {role === 'public' && (
            <>

              <Text style={styles.inputtitle}>Email</Text>
              <CustomField
                value={email}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <Text style={styles.inputtitle}>Password</Text>
              <CustomField
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                placeholder="Enter your password"
                secureTextEntry
              />
            </>
          )}
          {/**police log is not yet working i have to create custom token for authentication in firebase*/}
          {role === 'police' && (
            <>
              <Text style={styles.inputtitle}>Badge Number</Text>
              <CustomField
                value={badgeNumber}
                placeholder="Enter your badge number"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                onChangeText={setBadgeNumber}
              />

              <Text style={styles.inputtitle}>Password</Text>
              <CustomField
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                placeholder="Enter your password"
                secureTextEntry
              />
            </>
          )}

          <CustomButton
            title="Sign In"
            onPress={handleSignIn}
            style={styles.customButton}
            textStyle={styles.customButtonText}
          />
          {/**im using thsese buttons to navigate withou loggin */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.roleButtonstyles]}
              onPress={onPeople}
            >
              <Text style={[styles.buttonText,]}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton,]}
              onPress={onPolice}
            >
              <Text style={[styles.buttonText,]}>Police</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/sign-up" style={styles.signupLink}>
              Signup
            </Link>
          </View>
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
  innerContainer: {
    width: '100%',
    paddingTop: 60,
    paddingHorizontal: 11,
  },
  logo: {
    width: 115,
    height: 35,
    alignSelf: 'center',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginTop: 40,
    textAlign: 'center',
  },
  inputtitle: {
    color: 'white',
    padding: 3,

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#4A4A4A',
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedButton: {
    backgroundColor: '#EB6C24',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  selectedButtonText: {
    color: 'white',
  },
  customButton: {
    marginTop: 20,
  },
  customButtonText: {
    fontSize: 18,
  },
  border: {
    borderWidth: 1,
    borderColor: '#EB6C24',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white'
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    justifyContent: 'center',
    paddingTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  footerText: {
    fontSize: 17,
    color: '#d1d5db',
  },
  signupLink: {
    fontSize: 17,
    fontWeight: '600',
    color: '#EB6C24',
  },
});

export default SignIn;
