import { ImageBackground, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, Redirect, router, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/images';
import CustomButton from '@/components/CustomButton';
import { useEffect } from 'react';
import { FIREBASE_AUTH } from '@/services/firebaseConfig';

export default function Index() {
  const router = useRouter();
  // Check if user is authenticated
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    // You can add any initialization logic here
  }, []);

  // If user is authenticated, redirect to people home
  if (user) {
    return <Redirect href="/(people)/peoplehome" />;
  }

  const handleLogin = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.containerview}>
          <Image style={styles.logo} resizeMode="contain" source={images.logo} />
          <Image style={styles.badge} resizeMode="contain" source={images.SAPS} />
          <View style={styles.textcontent}>
            <Text style={styles.text}>South African's Missing:</Text>
            <Text style={styles.text1}>Broadcast Emergency Response</Text>
            <Text style={styles.text2}>
              Your safety is our priority. Stay updated with the latest alerts.
            </Text>
            <Text style={styles.text3}>
              Together, we can help find missing persons quickly and efficiently.
            </Text>
          </View>
        </View>
        <CustomButton
          onPress={handleLogin}
          title="Continue With Email"
          style={styles.customButton}
          textStyle={styles.customButtonText}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  containerview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  badge: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  textcontent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  text1: {
    fontSize: 20,
    color: '#EB6C24',
    marginBottom: 20,
    textAlign: 'center',
  },
  text2: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.8,
  },
  text3: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.6,
  },
  customButton: {
    backgroundColor: '#EB6C24',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 60,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
