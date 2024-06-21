// Local Imports
import React, { useContext } from 'react'
import { Text, StyleSheet, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from '../styling/colortheme.js'; 

// Functions checks for light or dark mode and exports the settings view
export default function Settings() {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const themeTextStyle = isDarkMode ? styles.darkThemeText : styles.lightThemeText;
    const themeContainerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;

    return (
        <View style={[styles.container, themeContainerStyle]}>
            <Text style={[styles.text, themeTextStyle]}>Color scheme: {isDarkMode ? 'dark' : 'light'}</Text>
            <Button title="Toggle Theme" onPress={toggleTheme} />
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
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
});