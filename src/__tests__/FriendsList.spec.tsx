import React from 'react';

import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import Wrapper from './mocks/ApolloMockWrapper';
import FriendsList from '../components/FriendsList';
import mockedUsers from './mocks/mockedUsers';

jest.mock('react-router-native', () => {
    return {
        useNavigate: () => null,
    };
});
const TestComponent = () => (
    <Provider>
        <Wrapper>
            <FriendsList />
        </Wrapper>
    </Provider>
);

describe('<FriendList /> testit', () => {
    it('Frendit renderöityy...', async () => {
        const { getByText, toJSON } = render(<TestComponent />);
        const me = mockedUsers[0];
        expect(getByText('Loading...')).toBeDefined();
        // Odotetaan että molemmat kaverit löytyy ja että ne myös näkyy
        await waitFor(() => {
            if (!me.friends) return;
            expect(getByText(me.friends[0].name)).toBeDefined();
            expect(getByText(me.friends[1].name)).toBeDefined();
        });
        expect(toJSON()).toMatchSnapshot();
    });

});
