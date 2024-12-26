import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import PeopleProfile from './peopleprofile';
import PeopleHomeScreen from './peoplehome';
import PeopleCases from './peoplecases';
import PeopleSettings from './peoplesettings';
import CaseDetails from './casedetails';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const PeopleLayout = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: true,
      tabBarActiveTintColor: '#EB6C24',
      tabBarInactiveTintColor: '#aaa',
      tabBarStyle: {
        backgroundColor: '#161622',
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.7)",
        height: 55, 
      }
    }}
    >
      <Tab.Screen name="Home" component={PeopleHomeScreen} options={{
        headerShown: false,
        title: 'Home',
        tabBarIcon: ({ color, size }) => (<AntDesign name="home" size={size} color={color} />),
      }} />
      <Tab.Screen name="Cases" component={PeopleCases} options={{
        headerShown: false,
        title: 'Cases',
        tabBarIcon: ({ size, color }) => (<MaterialIcons name="cases" size={size} color={color} />)
      }} />
      <Tab.Screen name="Profile" component={PeopleProfile} options={{
        headerShown: false,
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Settings" component={PeopleSettings} options={{
        headerShown: false,
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-outline" size={size} color={color} />
        ),
      }} />
    </Tab.Navigator>
  );
}

const PeopleApp = () => {
  return (
    <Stack.Navigator>
      
      <Stack.Screen name="PublicTabs" component={PeopleLayout} options={{ headerShown: false }} />
      <Stack.Screen name="CaseDetails" component={CaseDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default PeopleApp;

const styles = StyleSheet.create({})