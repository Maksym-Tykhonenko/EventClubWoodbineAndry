import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const EventDetailsScreen = ({route}: any) => {
  const {event} = route.params; // Отримання даних події
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    setIsBooked(true);
    Alert.alert(
      'Booking Confirmed',
      `You have successfully booked a spot for ${event.title}! 🎉`,
    );
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/fon.webp')} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={
            typeof event.image === 'string' ? {uri: event.image} : event.image
          }
          style={styles.eventImage}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>{event.date}</Text>
          <Text style={styles.eventDescription}>
            Join us for an unforgettable experience at {event.title}!
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, isBooked && styles.buttonDisabled]}
        onPress={handleBooking}
        disabled={isBooked}>
        <Text style={styles.buttonText}>
          {isBooked ? 'Booked ✅' : 'Book Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 40,
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
  scrollContainer: {
    padding: 20,
  },
  eventImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  detailsContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  eventTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  eventDate: {
    color: 'gray',
    fontSize: 18,
    marginTop: 5,
  },
  eventDescription: {
    color: 'white',
    marginTop: 15,
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'red',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventDetailsScreen;
