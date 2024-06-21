// React Imports
import * as React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";

// Local Imports
import AppMap from "../pages/map";
import ChatHistory from "../pages/chat-history";
import Settings from "../pages/settings";
import { ThemeContext } from '../styling/colortheme.js';
import DetailScreen from '../pages/detail.js';

// Creates the Stack Navigator
const Stack = createNativeStackNavigator();

// Actual view of the navigator, includes touchableOpacity as button for styling purposes. Navigates to certain page components
function NavigationPage({ navigation }) {
    // Initiazes isDarkMode
    const { isDarkMode } = useContext(ThemeContext);
    return (
        <View style={styles.flexColumn}>
            <Image style={styles.background} source={require('../pic/backdrop.jpg')} />
            <View style={styles.flexRow}>
                <TouchableOpacity
                    style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={() => navigation.navigate('Map')}
                >
                    <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>See the map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={() => navigation.navigate('Chat')}
                >
                    <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>See chats</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Navigator that has the name and component inside
export default function NavigationScreen() {
    // Initiazes iDarkMode so the nav bar displays as light/dark
    const { isDarkMode } = useContext(ThemeContext);
    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName="Navigation">
                <Stack.Screen name="Navigation" component={NavigationPage} />
                <Stack.Screen name="Map" component={AppMap} />
                <Stack.Screen name="Chat" component={ChatHistory} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="DetailScreen" component={DetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Styling with stylesheet
const styles = StyleSheet.create({
    flexRow: {
        flex: 1,
        marginBottom: 25,
        width: '100%', 
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
    },
    flexColumn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    darkContainer: {
        backgroundColor: '#242c40',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    lightButton: {
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        borderWidth: 1,
    },
    darkButton: {
        backgroundColor: '#444444',
        borderColor: '#ffffff',
        borderWidth: 1,
    },
    lightButtonText: {
        color: '#000000',
    },
    darkButtonText: {
        color: '#ffffff',
    },
});
