import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../services/firebaseConfig';
import { collection, doc, setDoc } from "firebase/firestore";
import CustomField from '@/components/customfield';
import CustomButton from '@/components/CustomButton';

const provinces = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
    'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
];

export default function SignupScreen() {
    const [role, setRole] = useState('public');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [province, setProvince] = useState('');
    const [badgeNumber, setBadgeNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;

    const handleSignup = async () => {
        setLoading(true);
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredentials.user.uid;

            const userProfile = {
                name,
                surname,
                contactNumber,
                email,
                role,
                province,
                badgeNumber: role === 'police' ? badgeNumber : null,
            };

            const userCollection = role === 'police' ? 'police_users' : 'public_users';
            const userRef = doc(collection(db, userCollection), userId);
            await setDoc(userRef, userProfile);

            Alert.alert('Sign Up Successful', 'You have been successfully registered.');
            navigation.navigate('sign-in');
        } catch (error) {
            Alert.alert('Sign Up Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={[styles.innerContainer, { minHeight: Dimensions.get('window').height - 100 }]}>
                    <Text style={styles.title}>Sign Up</Text>

                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue) => setRole(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Public" value="public" />
                        <Picker.Item label="Police" value="police" />
                    </Picker>

                    <CustomField
                        value={name}
                        placeholder="Enter your name"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        onChangeText={setName}
                    />
                    <CustomField
                        title="Surname"
                        value={surname}
                        placeholder="Enter your surname"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        onChangeText={setSurname}
                    />
                    {role === 'public' && (
                        <CustomField
                            title="Contact Number"
                            value={contactNumber}
                            placeholder="Enter your contact number"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            onChangeText={setContactNumber}
                            keyboardType="phone-pad"
                        />
                    )}
                    {role === 'police' && (
                        <CustomField
                            title="Badge Number"
                            value={badgeNumber}
                            placeholder="Enter your badge number"
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            onChangeText={setBadgeNumber}
                        />
                    )}
                    <CustomField
                        title="Email"
                        value={email}
                        placeholder="Enter your email"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <CustomField
                        title="Password"
                        value={password}
                        placeholder="Enter your password"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Picker
                        selectedValue={province}
                        onValueChange={(itemValue) => setProvince(itemValue)}
                        style={styles.picker}
                    >
                        {provinces.map((province, index) => (
                            <Picker.Item key={index} label={province} value={province} />
                        ))}
                    </Picker>

                    <CustomButton
                        title="Sign Up"
                        onPress={handleSignup}
                        style={styles.customButton}
                        textStyle={styles.customButtonText}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <Link href="/sign-in" style={styles.signinLink}>
                            Login
                        </Link>
                    </View>

                    {loading && <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161622',
        alignItems: 'center'
    },
    innerContainer: {
        width: '100%',
        paddingHorizontal: 11,
        flex: 1,
        justifyContent: 'center',
    },
    scrollView: {
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    picker: {
        height: 30,
        width: '100%',
        marginBottom: 6,
        paddingTop: 2,
        backgroundColor: '#1f1f2e',
        color: '#ffffff',
        borderRadius: 10,
    },
    border: {
        borderWidth: 1,
        borderColor: '#EB6C24',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: 'white',
    },
    customButton: {
        marginTop: 6,
    },
    customButtonText: {
        fontSize: 18,
    },
    loader: {
        marginTop: 10,
    },
    footer: {
        justifyContent: 'center',
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 18,
        color: '#d1d5db',
    },
    signinLink: {
        fontSize: 18,
        fontWeight: '600',
        color: '#EB6C24',
        marginLeft: 8,
    },
});
