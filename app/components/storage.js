import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PROGRESS = 'progress';
const KEY_CLAIMED_MARKERS = 'claimedMarkers';
const KEY_CLAIMED_TEXT = 'claimedText';

export const saveProgress = async (progress, claimedMarkers, claimedText) => {
    try {
        await AsyncStorage.setItem(KEY_PROGRESS, JSON.stringify(progress));
        await AsyncStorage.setItem(KEY_CLAIMED_MARKERS, JSON.stringify(claimedMarkers));
        await AsyncStorage.setItem(KEY_CLAIMED_TEXT, JSON.stringify(claimedText));
    } catch (error) {
        console.error('Error saving progress:', error);
        throw error;
    }
};

export const loadProgress = async () => {
    try {
        const progress = await AsyncStorage.getItem(KEY_PROGRESS);
        const claimedMarkers = await AsyncStorage.getItem(KEY_CLAIMED_MARKERS);
        const claimedText = await AsyncStorage.getItem(KEY_CLAIMED_TEXT);

        console.log("this is progress" + progress)
        console.log("this is claimedmarkers" + claimedMarkers)
        console.log("this is claimedtext" + claimedText)
        return {
            progress: progress ? JSON.parse(progress) : 1,
            claimedMarkers: claimedMarkers ? JSON.parse(claimedMarkers) : 0,
            claimedText: claimedText ? JSON.parse(claimedText) : []
        };
    } catch (error) {
        console.error('Error loading progress:', error);
        throw error;
    }
};

export const clearProgress = async () => {
    try {
        await AsyncStorage.removeItem(KEY_PROGRESS);
        await AsyncStorage.removeItem(KEY_CLAIMED_MARKERS);
        await AsyncStorage.removeItem(KEY_CLAIMED_TEXT);
    } catch (error) {
        console.error('Error clearing progress:', error);
        throw error;
    }
};
