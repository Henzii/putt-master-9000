import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/react-testing';
import Settings from '../screens/Settings';
import { getMeMock, updateMySettingsMock } from './mocks/getMeMock';
import { Provider } from 'react-native-paper';

const wrappedSettings = () => (
    <Provider>
        <MockedProvider mocks={[getMeMock, updateMySettingsMock]} addTypename={true}>
            <Settings />
        </MockedProvider>
    </Provider>
);

describe('<Settings /> testit', () => {
    it('Renderöityy oikein', () => {
        const { getByText } = render(wrappedSettings());
        // Otsikot löytyy
        expect(getByText('Friends')).toBeDefined();
        expect(getByText('App info')).toBeDefined();
        expect(getByText('Delete account')).toBeDefined();
    });
    it('Kaveripyyntöjen blokkaus', async () => {
        const { getByTestId } = render(wrappedSettings());
        const kytkin = getByTestId('blockFriendRequestsSwitch');
        const nappi = getByTestId('blockFriendRequests');
        // Kytkin löytyy ja on false
        await waitFor(() => {
            expect(kytkin).toBeDefined();
            expect(kytkin.props.value).toBeFalsy();
        });
        // Klikataan kytkintä
        fireEvent.press(nappi);
        // Kytkimestä tuli totta
        await waitFor(() => {
            expect(kytkin.props.value).toBeTruthy();
        });
    });
});
