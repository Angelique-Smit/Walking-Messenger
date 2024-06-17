import AsyncStorage from '@react-native-async-storage/async-storage';


const storagePut = () => { 
    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('my-key', value);
        } catch (e) {
          console.log("did not save")
        }
    };
}


const storageGet = () => { 
    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('my-key');
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
          console.log("coudlnt find it")
        }
      };
}
