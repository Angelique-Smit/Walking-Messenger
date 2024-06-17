import { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

//Local Imports
import Home from "../pages/home";
import AppMap from "../pages/map";
import ChatHistory from "../pages/chat-history";
import Settings from "../pages/settings";

//Creates the Stack Navigator
const Stack = createNativeStackNavigator();

//Actual view of the navigator
function NavigationPage({ navigation }) {
    return (
        <View style={styles.flexColumn}>
            <Image style={styles.background} source={require('../pic/backdrop.jpg')} />
            <View style={styles.flexRow}>
                <Button title="Homepage" onPress={() => navigation.navigate('Home')} />
                <Button title="See the map" onPress={() => navigation.navigate('Map')} />
                <Button title="See chats" onPress={() => navigation.navigate('Chat')} />
                <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
            </View>
        </View>
    )
}

//Navigator
export default function NavigationScreen() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Navigation">
                <Stack.Screen name="Navigation" component={NavigationPage} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Map" component={AppMap} />
                <Stack.Screen name="Chat" component={ChatHistory} />
                <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

//Styling
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
        position: 'absolute',
    }
});
