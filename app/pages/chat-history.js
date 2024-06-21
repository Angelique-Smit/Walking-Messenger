import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you are using React Navigation

// Import the loadProgress function from storage.js
import { loadProgress } from '../components/storage.js';

const ChatHistoryScreen = () => {
  const navigation = useNavigation();
  const [claimedText, setClaimedText] = useState([]);

  useEffect(() => {
    // Load the progress data when the component mounts
    const fetchData = async () => {
      try {
        const progressData = await loadProgress();
        setClaimedText(progressData.claimedText);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    fetchData();
  }, []);

  const navigateToDetails = (textArray) => {
    // Navigate to DetailScreen with the selected claimedText array
    navigation.navigate('DetailScreen', { claimedText: textArray });
  };

  return (
    <View>
      {claimedText.map((scenario, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigateToDetails(scenario)}
          style={{ padding: 10, backgroundColor: '#e0e0e0', marginVertical: 5 }}
        >
          <Text>{`Chapter ${index + 1}`}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ChatHistoryScreen;
