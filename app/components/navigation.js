import * as React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, View, Image } from "react-native";

// Local Imports
import Home from "../pages/home";
import AppMap from "../pages/map";
import ChatHistory from "../pages/chat-history";
import Settings from "../pages/settings";
import { ThemeContext } from '../styling/colortheme.js';
import DetailScreen from '../pages/detail.js';

// Creates the Stack Navigator
const Stack = createNativeStackNavigator();

// Actual view of the navigator
function NavigationPage({ navigation }) {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <View style={[styles.flexColumn, isDarkMode && styles.darkContainer]}>
            <Image style={styles.background} source={require('../pic/backdrop.jpg')} />
            <View style={[styles.flexRow, isDarkMode && styles.darkContainer]}>
                <Button title="Homepage" onPress={() => navigation.navigate('Home')} />
                <Button title="See the map" onPress={() => navigation.navigate('Map')} />
                <Button title="See chats" onPress={() => navigation.navigate('Chat')} />
                <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
            </View>
        </View>
    );
}

// Navigator
export default function NavigationScreen() {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName="Navigation">
                <Stack.Screen name="Navigation" component={NavigationPage} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Map" component={AppMap} />
                <Stack.Screen name="Chat" component={ChatHistory} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="DetailScreen" component={DetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Styling
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
});
