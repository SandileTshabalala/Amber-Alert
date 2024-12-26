// FormField.js
import { React ,useState }from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

const FormField = ({ title, value, placeholder, placeholderTextColor, handleChangeText, ...props }) => {
  const [showPassword,setshowPasword] = useState(false);
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={handleChangeText}
        {...props}
        secureTextEntry={title=== 'Password' && !showPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
  },
  title: {
    color: 'white',
    marginBottom: 3,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'white', // Ensures the text input text is white
  },
});

export default FormField;
