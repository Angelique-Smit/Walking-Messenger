//React imports
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View} from "react-native"

//Expo imports
import { StatusBar } from 'expo-status-bar';

//Local Imports
import getData from "../components/api.js";

const ChatHistory = () => {
    //Const data is for my JSON data and error is for error handling 
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
    //Start async function inside of a const. We're going to put this const inside setData
        const fetchData = async () => {

        try {
            //Get the actual data by using the getData import
            const fetchedData = await getData();

            //Sets the fetchedData inside setData (This is an object, to stringify it use json.stringify)
            setData(fetchedData);
        } catch (error) {
            //Error for console
            console.error("Error fetching data:", error);

            //Sets the error in my error const we made at the top
            setError("Error fetching data");
        }
    };

    //Initialises fetchData with a dependency hook so it only goes off 1 time.
    fetchData();
}, []);

//If error isnt empty and contains an actual error, use this display
if (error) {
    return (
        <View style={styles.container}>
        <Text>{error}</Text>
        <StatusBar style="auto" />
        </View>
    );
}

//If data is empty use this display
if (!data) {
    return (
        <View style={styles.container}>
        <Text>Loading...</Text>
        <StatusBar style="auto" />
        </View>
    );
}

//If everything is working as intended, use this display (data.character1) needs the conditional since its undefined when loading it in.
    return ( 
        <View style={styles.container}>
        <Text>{data.character1 ? data.character1.name : "character1 not found"}</Text>
        <StatusBar style="auto" />
        </View> 
    )
}

export default ChatHistory;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});