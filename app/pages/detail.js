// Imports from react
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Imports from local files
import { ThemeContext } from '../styling/colortheme.js';

const DetailScreen = ({ route }) => {
  // Retrieves the data inside the paramater, naming it "route"
  const { claimedText } = route.params;
  const { isDarkMode } = useContext(ThemeContext);

  // Returns the view, puts all items in a list element
  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <FlatList
            data={claimedText}
            renderItem={({ item }) => (
            <Text style={[styles.listItem, isDarkMode ? styles.darkListItem : styles.lightListItem]}>
                {item}
            </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    </View>
  );
};

// Stylesheet for the styling
const styles = StyleSheet.create({
  container: {
    height: '80%',
    padding: 16,
    overflow: 'scroll',
  },
  top: {
    height: '20%',
  },
  listItem: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '80%',
    marginBottom: '5%',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderBottomLeftRadius: 0,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  darkListItem: {
    backgroundColor: '#282828',
    color: '#f0f0f0',
  },
  lightContainer: {
    backgroundColor: '#f0f0f0',
  },
  lightListItem: {
    backgroundColor: '#ffffff',
    color: '#1c1c1c',
  },
});

export default DetailScreen;
