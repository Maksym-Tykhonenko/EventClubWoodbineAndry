import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EventsScreen from './src/screens/EventsScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import AlbumsScreen from './src/screens/AlbumsScreen'; // Додаємо сторінку альбомів

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const EventsStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen
      name="EventsMain"
      component={EventsScreen}
      options={{title: 'Events'}}
    />
    <Stack.Screen
      name="EventDetails"
      component={EventDetailsScreen}
      options={{title: 'Event Details'}}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({color, size}) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Events') iconName = 'calendar';
            else if (route.name === 'Quests') iconName = 'trophy';
            else if (route.name === 'Albums') iconName = 'image-album';
            else if (route.name === 'Profile') iconName = 'account';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {backgroundColor: 'black'},
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Events" component={EventsStack} />
        <Tab.Screen name="Quests" component={QuestsScreen} />
        <Tab.Screen name="Albums" component={AlbumsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
