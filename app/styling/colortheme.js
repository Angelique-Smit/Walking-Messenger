// Imports from react
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Runs the createContext function from react in this const
export const ThemeContext = createContext();

// Handles logic of dark/light mode
export const ThemeProvider = ({ children }) => {
    // Initiate state for dark mode (Off=light)
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Loads the locally prefered mode (dark/light) based on
        const loadTheme = async () => {
            try {
                //Gets the prefered mode from asyncstorage
                const storedTheme = await AsyncStorage.getItem('theme');

                //Standard mode if there is nothing saved inside the local storage
                if (storedTheme !== null) {
                    setIsDarkMode(storedTheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
        };

        loadTheme();
    }, []);

    // Saves the prefered theme to the local storage
    useEffect(() => {
        const saveTheme = async () => {
            try {
                await AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            } catch (error) {
                // Gives an error if saving fails
                console.error('Failed to save theme:', error);
            }
        };
        // Starts the function inside saveTheme
        saveTheme();
        // Activates everytime isDarkMode is triggered
    }, [isDarkMode]);

    // When the toggle button is pressed, it goes back to the previous stage (from light to dark or dark to light) to toggle between the two modes
    const toggleTheme = () => {
        setIsDarkMode(previousState => !previousState);
    };

    // Returns the view based on isDarkMode with the children elements inside
    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};