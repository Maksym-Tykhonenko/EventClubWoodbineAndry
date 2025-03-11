import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  TextInput,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const {width} = Dimensions.get('window');

const mockEvents = [
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

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const banners = [
    {id: '1', image: require('../assets/banner.webp')},
    {id: '2', image: require('../assets/banner1.webp')},
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        if (parsedEvents.length === 0) {
          await AsyncStorage.setItem('events', JSON.stringify(mockEvents));
          setEvents(mockEvents);
        } else {
          setEvents(parsedEvents);
        }
      } else {
        await AsyncStorage.setItem('events', JSON.stringify(mockEvents));
        setEvents(mockEvents);
      }
    } catch (error) {
      console.error('Failed to load events', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
//<Image style={styles.image} source={require('../assets/fon.webp')} />
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <ImageBackground style={{flex:1, height: windowHeight}} source={require('../assets/Background.png')}>
      <Text style={styles.header}>Welcome to Woodbine Club</Text>

      {/* Горизонтальний список банерів */}
      <FlatList
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.bannerContainer}>
            <Image source={item.image} style={styles.bannerImage} />
          </View>
        )}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Events')}>
          <Icon name="calendar" size={30} color="white" />
          <Text style={styles.buttonText}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profile')}>
          <Icon name="account" size={30} color="white" />
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Пошукова панель */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          placeholderTextColor="gray"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <Text style={styles.subHeader}>Upcoming Events</Text>

      {/* Відображення подій */}
      <FlatList
        data={filteredEvents}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() =>
              navigation.navigate('Events', {
                screen: 'EventDetails',
                params: {event: item},
              })
            }>
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
      /></ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 40,
    padding: 20,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
  },
  image: {
    position: 'absolute',
    left: -20,
    top: -40,
    right: -20,
    bottom: -40,
    width: '120%',
    height: '120%',
  },
  bannerContainer: {marginRight: 10, borderRadius: 10, overflow: 'hidden'},
  bannerImage: {width: width * 0.8, height: 180, borderRadius: 10},
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    width: 100,
  },
  buttonText: {color: 'white', marginTop: 5, fontWeight: 'bold'},
  eventCard: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  eventImage: {width: 100, height: 100, borderRadius: 10},
  eventTitle: {color: 'white', fontWeight: 'bold', marginTop: 5},
  eventDate: {color: 'gray'},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {marginRight: 5},
  searchInput: {flex: 1, color: 'white', height: 40},
});

export default HomeScreen;
