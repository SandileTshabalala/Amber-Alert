import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Image, TextInput, Alert, StyleSheet } from "react-native";
import images from "@/constants/images";

const SearchInput = ({ onSearch }) => {
  const navigation = useNavigation();

  const [query, setQuery] = useState("");
  
  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);
  
  const isValidQuery = (query) => {
    if (query.length < 3) {
      return false; 
    }
    if (/[^a-zA-Z0-9 ]/.test(query)) {
      return false; 
    }
    return true; 
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchField}
        value={query}
        placeholder="Search a name or surname"
        placeholderTextColor="#aaa"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "") {
            return Alert.alert(
              "Missing Information",
              "Please Search by name or surname to search a case"
            );
          }
          if (!isValidQuery(query)) { // Custom validation function
            return Alert.alert(
              "Invalid Query",
              "The search query is invalid. Please try again."
            );
          }
          navigation.navigate('SearchResults', { query }); 
        }}
      >
        <Image source={images.searchIcon} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1f1f2e',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EB6C24',
    height: 60,
    marginBottom: 20,
  },
  searchField: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginVertical: 0,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
});

export default SearchInput;
