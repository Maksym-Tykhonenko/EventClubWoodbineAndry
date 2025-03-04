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
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';

const AlbumsScreen = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  // Завантаження альбомів
  const loadAlbums = async () => {
    try {
      const storedAlbums = await AsyncStorage.getItem('albums');
      if (storedAlbums) {
        setAlbums(JSON.parse(storedAlbums));
      }
    } catch (error) {
      console.error('Failed to load albums', error);
    }
  };

  // Додавання нового альбому
  const addAlbum = async () => {
    if (!newAlbumTitle) {
      Alert.alert('Error', 'Please enter an album title.');
      return;
    }

    const newAlbum = {
      id: Date.now().toString(),
      title: newAlbumTitle,
      photos: [],
    };

    const updatedAlbums = [...albums, newAlbum];
    setAlbums(updatedAlbums);
    await AsyncStorage.setItem('albums', JSON.stringify(updatedAlbums));

    setNewAlbumTitle('');
    setModalVisible(false);
  };

  // Додавання фото до альбому
  const addPhotoToAlbum = async (albumId: string) => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        const selectedPhoto = response.assets[0].uri;

        const updatedAlbums = albums.map(album =>
          album.id === albumId
            ? {...album, photos: [...album.photos, selectedPhoto]}
            : album,
        );

        setAlbums(updatedAlbums);
        await AsyncStorage.setItem('albums', JSON.stringify(updatedAlbums));

        const updatedAlbum = updatedAlbums.find(album => album.id === albumId);
        setSelectedAlbum(updatedAlbum);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Event Albums</Text>

      {/* Кнопка для створення нового альбому */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Create Album</Text>
      </TouchableOpacity>

      {/* Відображення альбомів */}
      <FlatList
        data={albums}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.albumCard}
            onPress={() => setSelectedAlbum(item)}>
            <Text style={styles.albumTitle}>{item.title}</Text>
            <Text style={styles.albumCount}>{item.photos.length} photos</Text>
          </TouchableOpacity>
        )}
      />

      {/* Вікно для створення альбому */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Album</Text>
            <TextInput
              style={styles.input}
              placeholder="Album Title"
              placeholderTextColor="gray"
              value={newAlbumTitle}
              onChangeText={setNewAlbumTitle}
            />
            <TouchableOpacity style={styles.button} onPress={addAlbum}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Вікно перегляду фото у вибраному альбомі */}
      <Modal animationType="slide" transparent={true} visible={!!selectedAlbum}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedAlbum?.title}</Text>
            <ScrollView>
              <FlatList
                data={selectedAlbum?.photos}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                renderItem={({item}) => (
                  <Image source={{uri: item}} style={styles.photo} />
                )}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() => addPhotoToAlbum(selectedAlbum.id)}>
              <Text style={styles.addPhotoText}>+ Add Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedAlbum(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black', padding: 20},
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  albumCard: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  albumTitle: {color: 'white', fontWeight: 'bold', fontSize: 18},
  albumCount: {color: 'gray', marginTop: 5},
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
  button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  closeButton: {marginTop: 10, alignItems: 'center'},
  closeButtonText: {color: 'red', fontSize: 16},
  photo: {width: 100, height: 100, margin: 5, borderRadius: 10},
  addPhotoButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addPhotoText: {color: 'white', fontSize: 16},
});

export default AlbumsScreen;
