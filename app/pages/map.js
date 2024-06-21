// React imports
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Expo imports
import * as Location from 'expo-location';

// Local imports
import getData from '../components/api.js';
import { loadProgress, saveProgress, clearProgress } from '../components/storage.js';
import { ThemeContext } from '../styling/colortheme.js';

const AppMap = () => {
    // Define all consts
    const [markers, setMarkers] = useState([]);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [currentMarker, setCurrentMarker] = useState(null);
    const [claimedMarkers, setClaimedMarkers] = useState(0);
    const [claimedText, setClaimedText] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useContext(ThemeContext);
    const [location, setLocation] = useState(null);

    //Initiazes the map based off of the dark/light preference but takes its propperties from const darkModeMap/lightModeMap all the way at the bottom of the file
    const mapStyles = isDarkMode ? darkModeMap : lightModeMap;

    //Gets json data through the component getData
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieves data from getdata() (from my api.js)
                const data = await getData();

                // Makes everything under data.character1.messages into an array due to the object.values so it can be mapped.
                const messageScenarios = Object.values(data.character1.messages);

                // Fills the newMarkers with all the info from messageScenario's mapped with the key 'scenario' with the values messages and coords so it can be used on a map later
                const newMarkers = messageScenarios.map(scenario => ({
                    messages: scenario.message,
                    coords: {
                        latitude: scenario.coords.latitude,
                        longitude: scenario.coords.longitude
                    }
                }));

                // Saves all the markers that exist
                setMarkers(newMarkers);

                // Loads progress, claimedMarkers, and claimedText from AsyncStorage
                const { progress, claimedMarkers, claimedText } = await loadProgress();
                setCurrentProgress(progress);
                setClaimedMarkers(claimedMarkers);
                setClaimedText(claimedText);

                // Set currentMarker based on currentProgress so it remembers which marker you are at
                setCurrentMarker(newMarkers[currentProgress]);

                // Is done with loading
                setLoading(false);

            } catch (error) {
                // Sends an error if any of the above failed
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };

        // Performs the function once (due to the [])
        fetchData();
    }, []);

    // Gets your live location
    useEffect(() => {
        // Initiazes a variable that holds your current coordinates
        let locationSubscription;

        // Gets the actual location
        (async () => {
            locationSubscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
                (newLocation) => {
                    setLocation(newLocation);
                }
            );
        })();

        // Removes the location if permission for location is denied
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

    // Handles the claimed markers, so you go from 1 to 2 to 3 etc.
    const claimMarker = async () => {
        const newProgress = currentProgress + 1;

        // Check if trying to claim out of order or beyond available markers
        if (newProgress > markers.length) {
            Alert.alert('Unable to claim a new marker', 'You collected all the markers!');
            return;
        }

        // Update claimedText with the current marker's messages
        const newClaimedText = [
            ...claimedText,
            markers[currentProgress].messages
        ];

        // Update states
        setCurrentProgress(newProgress);
        setClaimedText(newClaimedText);
        setClaimedMarkers(newProgress);

        try {
            // Save progress, claimed marker index, and claimed text
            await saveProgress(newProgress, newProgress, newClaimedText);
            setCurrentMarker(markers[newProgress]); 

            // Gives succes alert
            Alert.alert('Marker Claimed!', `You've claimed Marker ${newProgress}.`);
        } catch (error) {
            // Gives error alert
            console.error('Error saving progress:', error);
            Alert.alert('Error', 'Failed to save progress.');
        }
    };

    // Removes the last claimed marker from the claimed marker/progress, making you go from 2 to 1 or 1 to 0 (etc.)
    const removeMarker = async () => {

        // Prevents going into the minus when removing markers
        if (currentProgress === 0) {
            Alert.alert('No Markers to Remove', 'You have not claimed any markers yet.');
            return;
        }

        // Lowers the currentProgress by 1 and and saves this
        const newProgress = currentProgress - 1;
        setCurrentProgress(newProgress);

        // Removes the claimed text so progress and claimed text are synced
        const newClaimedText = claimedText.slice(0, -1);
        setClaimedText(newClaimedText);
        setClaimedMarkers(newProgress);

        // Attempts to save this into the async storage
        try {
            await saveProgress(newProgress, newProgress, newClaimedText);
        } catch (error) {
            // Error message, couldn't be saved
            console.error('Error saving progress:', error);
            Alert.alert('Error', 'Failed to save progress.');
            return;
        }

        // Sets the next marker that can be claimed to the "new progress" (aka -1)
        setCurrentMarker(markers[newProgress]);

        // Alert it removed the marker correctly
        Alert.alert('Marker Removed!', `Marker ${currentProgress} removed.`);
    };

    // Resets the entire progress back to 0. Mostly for debugging
    const resetProgress = async () => {
        // Sets states back to 0 and an empty array for claimed text
        setCurrentProgress(0); 
        setClaimedMarkers(0);
        setClaimedText([]);

        // Calls on the clearProgress function from storage.js to save the reset progress in the async storage
        try {
            await clearProgress();
            console.log('Progress cleared.');
        } catch (error) {
            // Gives an error that your progress could not be reset
            console.error('Error clearing progress:', error);
            Alert.alert('Error', 'Failed to reset progress.');
        }

        // Sets the current marker to 0 so you can start claiming markers again
        setCurrentMarker(markers[0]); 

        // Gives a succes message
        Alert.alert('Progress Reset!', 'Marker progress has been reset to Message Scenario 1.');
    };

    // Handles loading so the page doesnt look blank if it has to load
    if (loading) {
        return (
            <View style={[styles.container, isDarkMode && styles.darkContainer]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Returns the view. Uses the promise of isDarkMode to determine if elements should be light/dark mode (except the map, that gets set all the way at the top of the code)
    // I wanted fancy smancy looking buttons so I used TouchableOpacity instead of the button element since these are easier to style AND it should look the same on android/IOS
    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <MapView
                style={styles.map}
                customMapStyle={mapStyles} 
                initialRegion={{
                    latitude: 51.917221,
                    longitude: 4.484050,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {currentMarker && (
                    <Marker
                        coordinate={{
                            longitude: currentMarker.coords.longitude,
                            latitude: currentMarker.coords.latitude,
                        }}
                        title={"Marker"}
                        description={"API hotspot marker"}
                    />
                )}

                {location && (
                    <Marker
                        coordinate={{
                            longitude: location.coords.longitude,
                            latitude: location.coords.latitude,
                        }}
                        title={"Me"}
                        description={"Marker for the user location"}
                    />
                )}
            </MapView>
            <View style={[styles.buttonContainer, isDarkMode && styles.darkContainer]}>
                <TouchableOpacity
                    style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={claimMarker}
                    disabled={currentProgress === markers.length}
                >
                    <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>Claim Marker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={removeMarker}
                    disabled={currentProgress === 0}
                >
                    <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>Remove Marker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
                    onPress={resetProgress}
                    disabled={currentProgress === 0}
                >
                    <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>Reset Progress</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Exports the AppMap const
export default AppMap;

// Stylesheet for all elements
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingBottom: 20,
    },
    map: {
        width: '100%',
        height: '100%',
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
    darkContainer: {
        backgroundColor: 'transparent',
    },
});

// Extra styling for the dark mode of the map so it doesnt look like 1 big blob of black
const darkModeMap = [
    {
        elementType: 'geometry',
        stylers: [
            {
                color: '#1E1E1E' // Color of the actual map
            }
        ]
    },
    {
        elementType: 'labels.icon',
        stylers: [
            {
                visibility: 'off' // Turns off markers from google maps (not your own markers though)
            }
        ]
    },
    {
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#CCCCCC' // Text infill color
            }
        ]
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [
            {
                color: '#CCCCCC' // Text outline color
            }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#666666' // Map outline color
            }
        ]
    },
    {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#CCCCCC' // Text for country labels
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
            {
                color: '#2E2E2E' // Color for roads
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#FFFFFF' // White text for big boy road labels
            }
        ]
    },
    {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#FFFFFF' // White text for local road labels
            }
        ]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#CCCCCC' // Lighter gray text for points of interest labels
            }
        ]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
            {
                color: '#3F3F3F' // Color for parks
            }
        ]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#9E9E9E' // Label for parks
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
            {
                color: '#0D0D0D' // Colors the water :O
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#333333' // Colors the label infill of the name of the waters
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
            {
                color: '#4A4A4A' // LIFE IS A HIGHWAY, I WANNA COLOR IT #4A4A4A
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#D4D4D4' // LIFE IS A HIGHWAY, I WANNA COLOR THE LABELS #D4D4D4
            }
        ]
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [
            {
                color: '#2f3948' // Dark gray for transit lines
            }
        ]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#CCCCCC' // Lighter gray text for transit station labels
            }
        ]
    },
    {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [
            {
                color: '#333333' // Dark gray for landscape geometry
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#212A37' // Road outline color
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
            {
                visibility: 'off' // Hide icons on roads (e.g., tolls, rests)
            }
        ]
    }
];

//Empty array for light mode so it takes the default settings from google maps for lightmode
const lightModeMap = [];
