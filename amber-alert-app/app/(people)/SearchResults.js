import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FIREBASE_DB } from '../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import images from '@/constants/images';

const SearchResults = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { query } = route.params;

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'alerts'));
        const allCases = querySnapshot.docs.map((doc) => doc.data());

        const filteredResults = allCases.filter(
          (caseItem) =>
            caseItem.name.toLowerCase().includes(query.toLowerCase()) ||
            caseItem.surname.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchResults();
  }, [query]);

  const handleCasePress = (caseItem) => {
    navigation.navigate('CaseDetails', { caseItem });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <View style={styles.caseImageContainer}>
              <Image source={{ uri: item.image }} style={styles.caseImage} />
            </View>
            <View style={styles.caseDetailsContainer}>
              <Text style={styles.caseName}>
                {item.name} {item.surname}
              </Text>
              <Text style={styles.caseAge}>Age: {item.age}</Text>
              <Text style={styles.caseContactNumber}>
                Contact: {item.contactNumber}
              </Text>
              {item.reward && (
                <View>
                  <Text style={styles.rewardText}>
                    Reward: R{item.reward.amount}
                  </Text>
                </View>
              )}
              <Text style={[styles.caseStatus, { color: item.status === 'ongoing' ? 'red' : 'green' }]}>
                Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => handleCasePress(item)}
              >
                <Text style={styles.viewMoreButtonText}>View More Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#1f1f2e',
    marginBottom: 10,
  },
  caseImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 16,
  },
  caseImage: {
    width: '100%',
    height: '100%',
  },
  caseDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  caseName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  caseAge: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  caseContactNumber: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  rewardText: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 5,
  },
  caseStatus: {
    color: 'gray',
    fontSize: 14,
    marginBottom: 10,
  },
  viewMoreButton: {
    backgroundColor: '#EB6C24',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SearchResults;
