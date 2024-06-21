// React imports
import React, { useEffect, useState, useContext } from 'react';
import { View, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Expo imports
import * as Location from 'expo-location';

// Local imports
import getData from '../components/api.js';
import { loadProgress, saveProgress, clearProgress } from '../components/storage.js';
import { ThemeContext } from '../styling/colortheme.js';
// import darkModeMap from '../styling/darkmodemap.json';
// import lightModeMap from '../styling/lightmodemap.json';

const AppMap = () => {
    const [markers, setMarkers] = useState([]);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [currentMarker, setCurrentMarker] = useState(null);
    const [claimedMarkers, setClaimedMarkers] = useState(0);
    const [claimedText, setClaimedText] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useContext(ThemeContext);
    const [location, setLocation] = useState(null);
    // const [mapStyle, setMapStyle] = useState(darkModeMap);
    const mapStyles = isDarkMode ? darkModeMap : lightModeMap;

    // useEffect(() => {
    //     const mapColor = async () => {
    //         try {
    //             const storedTheme = await AsyncStorage.getItem('theme'); 
    //             console.log(storedTheme)
    //             if (storedTheme == 'dark') {
    //                 setMapStyle(darkModeMap);
    //                 console.log(mapStyle)
    //             } else {
    //                 setMapStyle(lightModeMap);
    //             }
    //         } catch (error) {
    //             console.error('Error retrieving theme:', error);
    //         } 
    //     };
    //     mapColor();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getData();  // Fetch data from API or storage
                const messageScenarios = Object.values(data.character1.messages);

                const newMarkers = messageScenarios.map(scenario => ({
                    messages: scenario.message,
                    coords: {
                        latitude: scenario.coords.latitude,
                        longitude: scenario.coords.longitude
                    }
                }));

                setMarkers(newMarkers);

                // Load progress, claimedMarkers, and claimedText from AsyncStorage
                const { progress, claimedMarkers, claimedText } = await loadProgress();
                setCurrentProgress(progress);
                setClaimedMarkers(claimedMarkers);
                setClaimedText(claimedText);

                // Set currentMarker based on currentProgress
                setCurrentMarker(newMarkers[currentProgress]);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
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

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

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
            markers[currentProgress].messages // Use currentProgress for 0-based index
        ];

        // Update states
        setCurrentProgress(newProgress);
        setClaimedText(newClaimedText);
        setClaimedMarkers(newProgress);

        try {
            // Save progress, claimed marker index, and claimed text
            await saveProgress(newProgress, newProgress, newClaimedText);
            setCurrentMarker(markers[newProgress]); // Set the new current marker
            Alert.alert('Marker Claimed!', `You've claimed Marker ${newProgress}.`);
        } catch (error) {
            console.error('Error saving progress:', error);
            Alert.alert('Error', 'Failed to save progress.');
        }
    };

    const removeMarker = async () => {
        if (currentProgress === 0) {
            Alert.alert('No Markers to Remove', 'You have not claimed any markers yet.');
            return;
        }

        const newProgress = currentProgress - 1;
        setCurrentProgress(newProgress);

        const newClaimedText = claimedText.slice(0, -1);
        setClaimedText(newClaimedText);
        setClaimedMarkers(newProgress);

        try {
            await saveProgress(newProgress, newProgress, newClaimedText);
        } catch (error) {
            console.error('Error saving progress:', error);
            Alert.alert('Error', 'Failed to save progress.');
            return;
        }

        setCurrentMarker(markers[newProgress]);

        Alert.alert('Marker Removed!', `Marker ${currentProgress} removed.`);
    };

    const resetProgress = async () => {
        setCurrentProgress(0); 
        setClaimedMarkers(0);
        setClaimedText([]);

        try {
            await clearProgress();
            console.log('Progress cleared.');
        } catch (error) {
            console.error('Error clearing progress:', error);
            Alert.alert('Error', 'Failed to reset progress.');
        }

        setCurrentMarker(markers[0]); // Set to the first marker

        Alert.alert('Progress Reset!', 'Marker progress has been reset to Message Scenario 1.');
    };

    if (loading) {
        return (
            <View style={[styles.container, isDarkMode && styles.darkContainer]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

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
                <Button title="Claim Marker" onPress={claimMarker} disabled={currentProgress === markers.length} />
                <Button title="Remove Marker" onPress={removeMarker} disabled={currentProgress === 0} />
                <Button title="Reset Progress" onPress={resetProgress} disabled={currentProgress === 0} />
            </View>
        </View>
    );
};

export default AppMap;

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
    darkContainer: {
        backgroundColor: 'transparent',  
    },
    darkMap: {
        backgroundColor: '#000000',
    },
    lightThemeText: {
        color: '#242c40',
    },
    darkThemeText: {
        color: '#d0d0c0',
    },
});

const darkModeMap = [
    {
        elementType: 'geometry',
        stylers: [
            {
                color: '#1E1E1E' // Dark gray for map geometry
            }
        ]
    },
    {
        elementType: 'labels.icon',
        stylers: [
            {
                visibility: 'off' // Hide icons like pins and markers
            }
        ]
    },
    {
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#CCCCCC' // Lighter gray text for better readability
            }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#666666' // Lighter gray borders for administrative areas
            }
        ]
    },
    {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#CCCCCC' // Lighter gray text for country labels
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
            {
                color: '#2E2E2E' // Dark gray for roads
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#FFFFFF' // White text for road labels
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
                color: '#3F3F3F' // Slightly lighter color for park areas
            }
        ]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#9E9E9E' // Light gray text for park labels
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
            {
                color: '#0D0D0D' // Dark blue for water areas
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#333333' // Dark gray text for water labels
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
            {
                color: '#4A4A4A' // Grayish brown for highway roads
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#D4D4D4' // Light gray text for highway labels
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
                color: '#212A37' // Dark gray border for roads
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



const lightModeMap = [];
