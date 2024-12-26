import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB, STORAGE } from '../../services/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import CustomField from '../../components/customfield';
import CustomButton from '../../components/customebutton1';
import images from '@/constants/images';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const CreateAlert = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reward, setReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [geoTarget, setGeoTarget] = useState('Whole Country');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigation = useNavigation();
  const db = FIREBASE_DB;
  const storage = STORAGE;
  const specificNumbers = ['+27637152558', '+27638785052'];

  const handleCreateAlert = async () => {
    setLoading(true);
    try {
      let imageUrl = null;

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        const imageUploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
              setUploadingImage(true);
            },
            (error) => {
              console.error('Upload failed:', error);
              alert('Failed to upload image. Please try again.');
              setUploadingImage(false);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });

        imageUrl = await imageUploadPromise;
        setUploadingImage(false);
      }

      await addDoc(collection(db, 'alerts'), {
        name,
        surname,
        age,
        lastSeen,
        contactNumber,
        reward: reward ? { amount: rewardAmount, description: rewardDescription } : null,
        description,
        image: imageUrl,
        geoTarget,
        status: 'ongoing',
        createdAt: new Date(),
      });

      const alertMessage = `AMBER ALERT! 
            Name: ${name} ${surname}, 
            Age: ${age}, 
            Last Seen: ${lastSeen}, 
            Contact: ${contactNumber}, 
            Description: ${description}${reward ? `, Reward: ${rewardAmount} (${rewardDescription})` : ''}`;


      const backendUrl = 'http://localhost:3000/send-sms';
      const response = await axios.post(backendUrl, {
        to: specificNumbers, // Pass the array of numbers
        message: alertMessage,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Alert created and SMS sent successfully!');
      } else {
        Alert.alert('Error', 'Alert created but SMS failed to send.');
      }


      Alert.alert('Success', 'Alert created successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      //permission to access the camera roll
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // Set image URI if not cancelled
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.logocontainer}>
          <Image style={styles.logo} resizeMode='contain' source={images.logo} />
          <Text style={styles.title}>Create Alert</Text>
          <Image style={styles.logo2} resizeMode='contain' source={images.SAPS} />
        </View>

        <CustomField
          value={name}
          onChangeText={setName}
          placeholder="Enter the name"
        />

        <CustomField
          value={surname}
          onChangeText={setSurname}
          placeholder="Enter the surname"
        />

        <CustomField
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Enter the age"
        />

        <CustomField
          value={lastSeen}
          onChangeText={setLastSeen}
          placeholder="Enter the last seen location"
        />

        <CustomField
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
          placeholder="Enter the contact number"
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
          placeholder="Enter a description"
        />

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {uploadingImage && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Uploading Image: {Math.round(uploadProgress)}%</Text>
            <ActivityIndicator size="small" color="#EB6C24" />
          </View>
        )}

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>GeoTarget</Text>
          <Picker
            selectedValue={geoTarget}
            onValueChange={(itemValue) => setGeoTarget(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Whole Country" value="Whole Country" />
            <Picker.Item label="Province 1" value="Province 1" />
            <Picker.Item label="Province 2" value="Province 2" />
            <Picker.Item label="Province 3" value="Province 3" />
            <Picker.Item label="Province 4" value="Province 4" />
            <Picker.Item label="Province 5" value="Province 5" />
            <Picker.Item label="Province 6" value="Province 6" />
            <Picker.Item label="Province 7" value="Province 7" />
            <Picker.Item label="Province 8" value="Province 8" />
            <Picker.Item label="Province 9" value="Province 9" />
          </Picker>
        </View>

        <CustomButton
          onPress={handleCreateAlert}
          title="Create Alert"
          loading={loading}
          disabled={loading}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  logocontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logo: {
    width: 40,
    height: 30,
  },
  logo2: {
    width: 40,
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    backgroundColor: '#1f1f2e',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#EB6C24',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  progressText: {
    color: '#EB6C24',
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: '#1f1f2e',
    borderRadius: 10,
    marginBottom: 15,
  },
  pickerLabel: {
    color: '#aaa',
    paddingLeft: 15,
    paddingTop: 15,
  },
  picker: {
    color: 'white',
  },
  rewardDetails: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#EB6C24',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateAlert;
