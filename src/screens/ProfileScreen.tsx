import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';

const ProfileScreen = () => {
  const defaultUser = {
    name: '',
    email: '',
    avatar: '',
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(defaultUser.avatar);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedName = await AsyncStorage.getItem('name');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedAvatar = await AsyncStorage.getItem('avatar');

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedAvatar) setAvatar(storedAvatar);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('avatar', avatar);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri: any = response.assets[0].uri;
        setAvatar(imageUri);
        await AsyncStorage.setItem('avatar', imageUri);
      }
    });
  };

  const clearProfile = async () => {
    Alert.alert(
      'Clear Profile',
      'Are you sure you want to clear your profile?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          onPress: async () => {
            await AsyncStorage.clear();
            setName(defaultUser.name);
            setEmail(defaultUser.email);
            setAvatar(defaultUser.avatar);
            Alert.alert('Profile Cleared', 'All data has been removed.');
          },
        },
      ],
    );
  };

  // Logout
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', onPress: () => console.log('Logged out')},
    ]);
  };

  return (
    <View style={styles.container}>

      <Image style={styles.image} source={require('../assets/fon.webp')} />
      <TouchableOpacity onPress={pickImage}>
        <Image source={{uri: avatar}} style={styles.avatar} />
        <Text style={styles.editAvatarText}>Edit Avatar</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your last name"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.clearButton]}
        onPress={clearProfile}>
        <Text style={styles.buttonText}>Clear Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'red',
    marginBottom: 10,
  },
  editAvatarText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  image: {
    position: 'absolute',
    left: -20,
    flex: 1,
    right: -20,
    bottom: -40,
    top: -40,
    width: '120%',
    objectFit: 'cover',
    height: '120%',
  },
  input: {
    width: '100%',
    backgroundColor: '#333',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: 'gray',
  },
  logoutButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
