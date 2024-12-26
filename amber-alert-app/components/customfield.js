import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure to install react-native-vector-icons

const CustomField = ({
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  placeholder,
  secureTextEntry = false, // Prop to enable secure text entry
}) => {
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        secureTextEntry={secureTextEntry && showPassword} 
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={toggleShowPassword} style={styles.iconContainer}>
          <Icon
            name={showPassword ? 'eye-slash' : 'eye'} 
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 11,
    position: 'relative', // Added for positioning the icon
  },
  input: {
    backgroundColor: '#1f1f2e',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    paddingRight: 45, // Added padding for the icon
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
    top: '35%',
  },
});

export default CustomField;
