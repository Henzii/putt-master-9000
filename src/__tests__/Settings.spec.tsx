import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/react-testing';
import Settings from '../screens/Settings';
import { getMeMock, updateMySettingsMock } from './mocks/getMeMock';
import { Provider } from 'react-native-paper';
import { InMemoryCache } from 'apollo-boost';

const wrappedSettings = () => (
    <Provider>
        <MockedProvider mocks={[getMeMock, updateMySettingsMock]} addTypename={true}
            cache={
                new InMemoryCache({
                    addTypename: false,
                    fragmentMatcher: { match: () => true },
                })
            }>
            <Settings />
        </MockedProvider>
    </Provider>
);
jest.mock('react-router-native', () => {
    return {
        useNavigate: () => null,
    };
});
jest.mock('react-redux', () => {
    return {
        useDispatch: () => null,
    };
});

// Poistaa Switch-komponenttiin liittyvän turhan varoituksen
jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockComponent = require('react-native/jest/mockComponent');
    return mockComponent('react-native/Libraries/Components/Switch/Switch');
});

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
        // Kytkin löytyy ja on false
        await waitFor(() => {
            expect(kytkin).toBeDefined();
            expect(kytkin.props.value).toBeFalsy();
        });
        // Klikataan kytkintä
        fireEvent.press(kytkin.parent ?? kytkin);
        // Kytkimestä tuli totta
        await waitFor(() => {
            expect(kytkin.props.value).toBeTruthy();
        });
    });
});
