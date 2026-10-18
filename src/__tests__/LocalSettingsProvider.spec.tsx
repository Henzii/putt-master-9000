import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, Text } from 'react-native';
import LocalSettingsProvider, { useSettings } from '../context/LocalSettingsProvider';

function SettingsHarness() {
    const { setValue } = useSettings();

    return (
        <>
            <Pressable testID="setTheme" onPress={() => setValue('Theme', 'dark')}>
                <Text>Set theme</Text>
            </Pressable>
            <Pressable testID="setImperialUnits" onPress={() => setValue('ImperialUnits', true)}>
                <Text>Set units</Text>
            </Pressable>
        </>
    );
}

describe('LocalSettingsProvider', () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
    });

    it('stores updated settings in AsyncStorage', async () => {
        const { getByTestId } = render(
            <LocalSettingsProvider>
                <SettingsHarness />
            </LocalSettingsProvider>
        );

        fireEvent.press(getByTestId('setTheme'));
        fireEvent.press(getByTestId('setImperialUnits'));

        await waitFor(async () => {
            expect(await AsyncStorage.getItem('localSettings')).toBe(
                JSON.stringify({ Theme: 'dark', ImperialUnits: true })
            );
        });
    });
});
