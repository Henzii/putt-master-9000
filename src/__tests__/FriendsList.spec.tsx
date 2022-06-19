import React from 'react';

import { render, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/react-testing';
import FriendsList from '../components/FriendsList';
import { Provider } from 'react-native-paper';
import { InMemoryCache } from 'apollo-boost';
import { getMeWithFriendsMock } from './mocks/getMeMock';
import { mockedMe as testiMe } from './mocks/getMeMock';
jest.mock('react-router-native', () => {
    return {
        useNavigate: () => null,
    };
});

const Wrapped = () => (
    <Provider>
        <MockedProvider mocks={[getMeWithFriendsMock]} addTypename={true}
            cache={
                new InMemoryCache({
                  addTypename: false,
                  fragmentMatcher: { match: () => true},
                })
              }
        >
            <FriendsList />
        </MockedProvider>
    </Provider>
);

describe('<FriendList /> testit', () => {
    it('Frendit renderöityy...', async () => {
        const { getByText } = render(<Wrapped />);

        expect(getByText('Loading...')).toBeDefined();
        // Odotetaan että molemmat kaverit löytyy ja että ne myös näkyy
        await waitFor(() => {
            if (!testiMe.friends) return;
            expect(getByText(testiMe.friends[0].name)).toBeDefined();
            expect(getByText(testiMe.friends[1].name)).toBeDefined();
        });
    });

});
