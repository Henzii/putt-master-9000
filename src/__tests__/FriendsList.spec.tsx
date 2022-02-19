import React from 'react';

import { render, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/react-testing';
import { getCoursesMocks, testiMe } from './graphqlMocks';
import FriendsList from '../components/FriendsList';
import { Provider } from 'react-native-paper';

const Wrapped = () => (
    <Provider>
        <MockedProvider mocks={getCoursesMocks} addTypename={false}>
            <FriendsList />
        </MockedProvider>
    </Provider>
);

describe('<FriendList /> testit', () => {
    it('Frendit renderöityy...', async () => {
        const { getByText } = render(<Wrapped />);

        // Add Friend -nappi löytyy
        expect(getByText('Add friend')).toBeDefined();

        // Odotetaan että molemmat kaverit löytyy ja että ne myös näkyy
        await waitFor(() => {
            if (!testiMe.friends) return;
            expect(getByText(testiMe.friends[0].name)).toBeDefined();
            expect(getByText(testiMe.friends[1].name)).toBeDefined();
        });
    });

});
