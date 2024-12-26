import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';

const CustomButton = ({ onPress, title, style, textStyle }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.button, style]} 
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    backgroundColor: '#EB6C24',
    borderRadius: 12,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: 340,
  },
  text: {
    color: '#fff',
    fontWeight: '600', // Change 'semibold' to equivalent numeric value
    fontSize: 20,
  },
});

export default CustomButton;
