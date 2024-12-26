import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, doc, getDoc} from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../services/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/SearchInput';
import images from '@/constants/images';

const PoliceHomeScreen = () => {
  const [badgeNumber, setbadgeNumber] = useState('');
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const db = FIREBASE_DB;

  const userId = FIREBASE_AUTH.currentUser?.uid;

  // Fetch badge number
  const fetchUserData = async () => {
    if (!userId) return;

    try {
      const userDocRef = doc(FIREBASE_DB, 'police_users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setbadgeNumber(userData.badgeNumber || '');
      } else {
        console.log('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch cases 
  const fetchCases = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'alerts'));
      const allCases = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCases(allCases);
      setFilteredCases(allCases);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setLoading(false);
    }
  };

  // Filter cases by search query
  const filterCases = () => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = cases.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.surname.toLowerCase().includes(query)
      );
      setFilteredCases(filtered);
    } else {
      setFilteredCases(cases);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCases();
  }, [userId]);

  useEffect(() => {
    filterCases();
  }, [searchQuery, cases]);

  const handleCasePress = (caseItem) => {
    navigation.navigate('CaseDetails', { caseItem });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredCases}
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
        ListHeaderComponent={() => (
          <View style={styles.innercontainer}>
            <View style={styles.headerWrapper}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.badgeNumber}>ID :{badgeNumber}</Text>
              </View>

              <View style={styles.logoContainer}>
                <Image
                  source={images.logo}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View>
            </View>

            <SearchInput onSearch={(query) => setSearchQuery(query)} />

            <View style={styles.homeheader}>
              <Image source={images.SAPS} style={styles.headerlogo} />
              <Text style={styles.casestitle}>Cases</Text>
            </View>
          </View>

        )}
        ListFooterComponent={() => ( 
          <View style={styles.footer}>
            {loading && <ActivityIndicator size="large" color="#EB6C24" />}
            {!loading && filteredCases.length === 0 && (
              <Text style={styles.noResultsText}>No cases found.</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 8,
  },
  innercontainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '200',
    color: 'white',
    textAlign: 'left',
  },
  badgeNumber: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    textAlign: 'left',
  },
  logoContainer: {
    width: 50,
    height: 40,
    alignItems: 'flex-end',
  },
  logo: {
    width: '100%',
    height: '90%',
  },
  searchField: {
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1f1f2e',
  },
  activeFilterButton: {
    backgroundColor: '#EB6C24',
  },
  filterButtonText: {
    color: 'white',
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
    height: 120,
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
  rewardText:{
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
  homeheader: {
    flexDirection: 'row',
  },
  headerlogo: {
    width: 50,
    height: 50,
    marginRight: 10,
    alignSelf: 'center'
  },
  casestitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center'
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#aaa',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default PoliceHomeScreen;
