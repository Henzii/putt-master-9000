import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function firstTimeLaunched() {
    if (!(await AsyncStorage.getItem('firstTime'))) {
        await AsyncStorage.setItem('firstTime', 'false');
        return true;
    } else {
        return false;
    }
}