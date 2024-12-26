import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import CreateAlert from './createalert';
import PoliceProfile from './policeprofile';
import PoliceHomeScreen from './policehome';
import PoliceSettings from './policesetting';
import PoliceCases from './policecases';
import CaseDetails from './casedetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PoliceLayout = () => {
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
    }}>
      <Tab.Screen name="Home" component={PoliceHomeScreen} options={{
        headerShown: false,
        title: "Home",
        tabBarIcon: ({ color, size }) => (<AntDesign name="home" size={size} color={color} />),}} />
      <Tab.Screen name="Cases" component={PoliceCases} options={{
        headerShown: false,
        title: 'Cases',
        tabBarIcon: ({ size, color }) => (<MaterialIcons name="cases" size={size} color={color} />)
      }} />
      <Tab.Screen name="Create Alert" component={CreateAlert} options={{
        headerShown: false,
        title: 'Create Alert',
        tabBarIcon: ({ size, color }) => (<Feather name="plus-circle" size={size} color={color} />)
      }} />
      <Tab.Screen name="Profile" component={PoliceProfile} options={{
        headerShown: false,
        title: 'Profile',
        tabBarIcon: ({ size, color }) => (<MaterialCommunityIcons name="account" color={color} size={size} />)
      }} />
      <Tab.Screen name="Settings" component={PoliceSettings} options={{
        headerShown: false,
        title: 'Settings',
        tabBarIcon: ({ size, color }) => (<Ionicons name="settings-outline" size={size} color={color} />)
      }} />
    </Tab.Navigator>
  );
}

const PoliceApp = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PoliceTabs" component={PoliceLayout} options={{ headerShown: false }} />
      <Stack.Screen name="CaseDetails" component={CaseDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default PoliceApp;

const styles = StyleSheet.create({})