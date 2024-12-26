import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_DB } from '../../services/firebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';
import images from '@/constants/images';

const PoliceCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCases = () => {
      const casesCollection = collection(FIREBASE_DB, 'alerts');
      

      const unsubscribe = onSnapshot(casesCollection, (snapshot) => {
        const caseData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCases(caseData);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchCases();

    return () => unsubscribe();
  }, []);
  const handleCasePress = (caseItem) => {
    navigation.navigate('CaseDetails', { caseItem });
  };
  const handleAddCase = () => {
    navigation.navigate('Create Alert'); // Navigate to a screen where police can add new cases
  };

  const renderCaseItem = ({ item }) => (
    <TouchableOpacity style={styles.caseItem} onPress={() => handleCasePress(item)}>
      <Image source={images.casestudyicon} style={styles.caseIcon} />
      <View style={styles.caseInfo}>
        <Text style={styles.caseTitle}>{item.name} {item.surname}</Text>
        <Text style={styles.caseDescription}>{item.description}</Text>
        <Text style={styles.caseStatus}>Status: {item.status}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="#EB6C24" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cases</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCase}>
          <Feather name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Case</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#EB6C24" />
      ) : (
        <FlatList
          data={cases}
          keyExtractor={(item) => item.id}
          renderItem={renderCaseItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingTop:10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EB6C24',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
  },
  listContent: {
    paddingBottom: 100,
  },
  caseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f2e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  caseIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  caseInfo: {
    flex: 1,
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  caseDescription: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  caseStatus: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
});
export default PoliceCases;

