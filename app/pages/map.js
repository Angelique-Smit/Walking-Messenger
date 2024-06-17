// React imports
import React from 'react';
import { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native'; 

// Expo imports
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

//Local imports
import getData from "../components/api.js"

// Create the Map const (called AppMap since Map was already something else within JavaScript)
const AppMap = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                return;
            }
        })();
    }, []);

    useEffect(() => {
        let locationSubscription;
        
        (async () => {
            locationSubscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
                (newLocation) => {
                    setLocation(newLocation);
                }
            );
        })();

        // Cleanup the subscription on component unmount
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

    // const fetchJson = async () => {
    //     try {
    //         const data = await getData();
    //         return data;
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //         throw error; 
    //     }
    // };
    

    // fetchJson()
    //     .then(data => {
    //         console.log("JSON Data:", data.character1.messages.messageScenario1.coords.latitude);
    //     })
    //     .catch(error => {
    //         console.error("Error fetching character messages:", error);
    // });
    


    let text = 'Waiting..';

    if (error) {
        text = error;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 51.926517,
                        longitude: 4.462456,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    region={location ? {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    } : null}
                >
                    {location && (
                        <Marker
                            coordinate={{ 
                                latitude: location.coords.latitude, 
                                longitude: location.coords.longitude 
                            }}
                            title={"Current Location"}
                            description={"This is where you are"}
                        />
                    )}
                </MapView>
            </View>
        </View>
    );
}

export default AppMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
    mapContainer: {
        flex: 4,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
