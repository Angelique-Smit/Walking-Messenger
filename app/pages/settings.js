// React imports
import React, { useContext } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Local Imports
import { ThemeContext } from '../styling/colortheme.js';

// Functions checks for light or dark mode and exports the settings view
export default function Settings() {
    //Creates a useContext based on what comes back from theme (from colortheme.js)
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    // Checks isDarkMode. If it is 'dark' it uses darkTheme, otherwise LightTheme
    const themeTextStyle = isDarkMode ? styles.darkThemeText : styles.lightThemeText;
    const themeContainerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;

    // Returns the view in which the dark/lightmode can be toggled. Used touchable Opacity to make styling the buttons easier
    return (
        <View style={[styles.container, themeContainerStyle]}>
            <Text style={[styles.text, themeTextStyle]}>Color theme: {isDarkMode ? 'dark' : 'light'}</Text>
            <TouchableOpacity style={styles.toggleThemeButton} onPress={toggleTheme}>
                <Text style={styles.toggleThemeText}>Toggle Theme</Text>
            </TouchableOpacity>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        </View>
    );
}

// Stylesheet for styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10%',
    },
    text: {
        fontSize: 20,
        paddingTop: '5%',
    },
    lightContainer: {
        backgroundColor: '#d0d0c0',
    },
    darkContainer: {
        backgroundColor: '#242c40',
    },
    lightThemeText: {
        color: '#242c40',
    },
    darkThemeText: {
        color: '#d0d0c0',
    },
    toggleThemeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: '#444444',
        borderColor: '#ffffff',
        borderWidth: 1,
    },
    toggleThemeText: {
        color: '#FFFFFF', // Default text color
        textAlign: 'center',
    },
});
