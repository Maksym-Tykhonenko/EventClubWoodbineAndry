import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';

const defaultEvents = [
  {
    id: '1',
    title: 'Poker Night',
    date: 'March 10',
    image: require('../assets/poker.webp'),
  },
  {
    id: '2',
    title: 'Live Concert',
    date: 'March 15',
    image: require('../assets/live.webp'),
  },
  {
    id: '3',
    title: 'Exclusive Party',
    date: 'March 20',
    image: require('../assets/party.webp'),
  },
];

const EventsScreen = () => {
  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventImage, setNewEventImage] = useState<any | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        await AsyncStorage.setItem('events', JSON.stringify(defaultEvents));
        setEvents(defaultEvents);
      }
    } catch (error) {
      console.error('Failed to load events', error);
    }
  };

  const addEvent = async () => {
    if (!newEventTitle || !newEventDate || !newEventImage) {
      Alert.alert('Error', 'Please fill all fields and select an image.');
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      date: newEventDate,
      image: newEventImage,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));

    setNewEventTitle('');
    setNewEventDate('');
    setNewEventImage(null);
    setModalVisible(false);
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setNewEventImage(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/fon.webp')} />
      <Text style={styles.header}>Upcoming Events</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Event</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate('EventDetails', {event: item})}>
            <Image
              source={
                typeof item.image === 'string' ? {uri: item.image} : item.image
              }
              style={styles.eventImage}
            />
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              placeholderTextColor="gray"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Event Date (e.g., March 20)"
              placeholderTextColor="gray"
              value={newEventDate}
              onChangeText={setNewEventDate}
            />
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {newEventImage ? 'Image Selected ✅' : 'Pick an Image'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={addEvent}>
              <Text style={styles.buttonText}>Add Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    left: -20,
    flex: 1,
    right: -20,
    bottom: -40,
    top: -40,
    width: '120%',
    height: '120%',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingVertical: 40,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  button: {},
  buttonText: {
    textAlign: 'center',
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  eventTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 18,
  },
  eventDate: {
    color: 'gray',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default EventsScreen;
