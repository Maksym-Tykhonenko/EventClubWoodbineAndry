import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  ImageBackground
} from 'react-native';

const QuestsScreen = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [triviaAnswer, setTriviaAnswer] = useState('');
  const [memoryInput, setMemoryInput] = useState('');
  const [speedCount, setSpeedCount] = useState(0);
  const [mathAnswer, setMathAnswer] = useState('');
  const [showMemoryPrompt, setShowMemoryPrompt] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const memorySequence = '73914'; // Fixed sequence for Memory Test

  const testOptions = [
    {id: '1', title: 'Trivia Challenge', color: '#FF5733'},
    {id: '2', title: 'Memory Test', color: '#33FF57'},
    {id: '3', title: 'Puzzle Game', color: '#338FFF'},
    {id: '4', title: 'Speed Test', color: '#FFD700'},
    {id: '5', title: 'Math Quiz', color: '#FF33A1'},
    {id: '6', title: 'Riddle Challenge', color: '#FF8C00'},
    {id: '7', title: 'Shape Identification', color: '#00CED1'},
    {id: '8', title: 'Vocabulary Test', color: '#DA70D6'},
    {id: '9', title: 'Logic Challenge', color: '#8A2BE2'},
    {id: '10', title: 'Hidden Object Game', color: '#DC143C'},
  ];

  const startSpeedTest = () => {
    setSpeedCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSpeedCount(count);
      if (count >= 10) clearInterval(interval);
    }, 1000);
  };

  const startAnimation = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Show number for 3 seconds in Memory Test before asking user to enter it
  useEffect(() => {
    if (selectedTest === 'Memory Test') {
      setShowMemoryPrompt(true);
      const timer = setTimeout(() => {
        setShowMemoryPrompt(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedTest]);

  const renderTestContent = () => {
    if (!selectedTest) {
      return (
        <FlatList
          data={testOptions}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.testCard, {backgroundColor: item.color}]}
              onPress={() => {
                setSelectedTest(item.title);
                startAnimation();
              }}>
              <Text style={styles.testText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    return (
      <Animated.View style={[styles.testContainer, {opacity: fadeAnim}]}>
        <Text style={styles.testHeader}>{selectedTest}</Text>

        {selectedTest === 'Trivia Challenge' && (
          <View>
            <Text style={styles.questionText}>
              What is the capital of France?
            </Text>
            <TouchableOpacity
              onPress={() => setTriviaAnswer('Paris')}
              style={styles.optionButton}>
              <Text style={styles.optionText}>Paris</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTriviaAnswer('London')}
              style={styles.optionButton}>
              <Text style={styles.optionText}>London</Text>
            </TouchableOpacity>
            <Text style={styles.resultText}>
              {triviaAnswer === 'Paris'
                ? 'Correct ✅'
                : triviaAnswer
                ? 'Wrong ❌'
                : ''}
            </Text>
          </View>
        )}

        {selectedTest === 'Math Quiz' && (
          <View>
            <Text style={styles.questionText}>What is 7 + 5?</Text>
            <TextInput
              style={styles.input}
              placeholder="Your answer"
              keyboardType="numeric"
              value={mathAnswer}
              onChangeText={setMathAnswer}
            />
            <Text style={styles.resultText}>
              {mathAnswer === '12'
                ? 'Correct ✅'
                : mathAnswer
                ? 'Wrong ❌'
                : ''}
            </Text>
          </View>
        )}

        {selectedTest === 'Speed Test' && (
          <View>
            <Text style={styles.questionText}>Tap as fast as you can!</Text>
            <TouchableOpacity style={styles.tapButton} onPress={startSpeedTest}>
              <Text style={styles.tapText}>Start</Text>
            </TouchableOpacity>
            <Text style={styles.resultText}>Taps: {speedCount}</Text>
          </View>
        )}

        {selectedTest === 'Memory Test' && (
          <View>
            {showMemoryPrompt ? (
              <Text style={styles.questionText}>
                Remember this number: {memorySequence}
              </Text>
            ) : (
              <>
                <Text style={styles.questionText}>
                  Enter the number you remembered:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your answer"
                  keyboardType="numeric"
                  value={memoryInput}
                  onChangeText={setMemoryInput}
                />
                <Text style={styles.resultText}>
                  {memoryInput === memorySequence
                    ? 'Correct ✅'
                    : memoryInput
                    ? 'Wrong ❌'
                    : ''}
                </Text>
              </>
            )}
          </View>
        )}

        {/* Placeholder for unimplemented quests */}
        {[
          'Puzzle Game',
          'Riddle Challenge',
          'Shape Identification',
          'Vocabulary Test',
          'Logic Challenge',
          'Hidden Object Game',
        ].includes(selectedTest!) && (
          <View>
            <Text style={styles.questionText}>
              This quest is not yet implemented.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setSelectedTest(null);
            setTriviaAnswer('');
            setMathAnswer('');
            setMemoryInput('');
            setSpeedCount(0);
            fadeAnim.setValue(0);
          }}>
          <Text style={styles.backButtonText}>Back to Quests</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={{ flex: 1 }} source={require('../assets/Background.png')}>
      <Text style={styles.header}>Choose a Quest</Text>
      {renderTestContent()}
      </ImageBackground>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingVertical: 40,
  },
  optionButton: {
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '80%',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tapButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  tapText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  testCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  testText: {color: 'white', fontSize: 20, fontWeight: 'bold'},
  testContainer: {alignItems: 'center', marginTop: 20},
  testHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  questionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#444',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 18,
  },
  resultText: {
    color: 'lightgreen',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 10,
  },
  backButtonText: {color: 'white', fontSize: 18, fontWeight: 'bold'},
});

export default QuestsScreen;
