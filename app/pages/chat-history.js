// React imports
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

// Import local components
import { loadProgress } from '../components/storage.js';
import { ThemeContext } from '../styling/colortheme.js';

const ChatHistoryScreen = () => {
    // Makes a navigation since this will be used to link to the details.js later
    const navigation = useNavigation();
    
    //Initiazes dark mode and claimed text
    const [claimedText, setClaimedText] = useState([]);
    const { isDarkMode } = useContext(ThemeContext);

    // Gets the claimedText out of the async storage so it can still be shown when offline
    useEffect(() => {
    const fetchData = async () => {
        try {
        const progressData = await loadProgress();
        setClaimedText(progressData.claimedText);
        } catch (error) {
        //gives error if loading fails
        console.error('Error loading progress:', error);
        }
    };
    // Initializes data
    fetchData();
    }, []);

    // Handles navigate to DetailScreen with the param claimedText (and the specific array number so you get to the specific set of messages)
    const navigateToDetails = (textArray) => {
    navigation.navigate('DetailScreen', { claimedText: textArray });
    };

    //Retuns the view. Uses the isDarkMode to decide between dark/light theme. Uses the .mao function on claimedText to sort the chapters inside a list
    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
            {claimedText.map((scenario, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => navigateToDetails(scenario)}
                style={[styles.listItem, isDarkMode ? styles.darkListItem : styles.lightListItem]}
            >
                <Text style={[styles.text, isDarkMode ? styles.darkThemeText : styles.lightThemeText]}>{`Chapter ${index + 1}`}</Text>
            </TouchableOpacity>
            ))}
        </View>
    );
};

// Stylesheet for styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    width: '90%',
  },
  text: {
    fontSize: 16,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  darkThemeText: {
    color: '#f0f0f0',
  },
  darkListItem: {
    backgroundColor: '#282828',
  },
  lightContainer: {
    backgroundColor: '#f0f0f0',
  },
  lightThemeText: {
    color: '#1c1c1c',
  },
  lightListItem: {
    backgroundColor: '#ffffff',
  },
});

// Handles the export
export default ChatHistoryScreen;
