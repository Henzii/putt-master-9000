import React from 'react';

import { render, waitFor } from '@testing-library/react-native';
import { Portal, Provider } from 'react-native-paper';
import Wrapper from './mocks/ApolloMockWrapper';
import FriendsList from '../components/FriendsList';
import mockedUsers from './mocks/mockedUsers';
import { theme } from '../utils/theme';

jest.useFakeTimers();

const TestComponent = () => (
    <Provider theme={theme}>
        <Wrapper>
            <Portal.Host>
                <FriendsList />
            </Portal.Host>
        </Wrapper>
    </Provider>
);

describe('<FriendList />', () => {
    it('should render properly', async () => {
        const { getByText, toJSON } = render(<TestComponent />);
        const me = mockedUsers[0];

        await waitFor(() => {
            if (!me.friends) return;
            expect(getByText(me.friends[0].name)).toBeDefined();
            expect(getByText(me.friends[1].name)).toBeDefined();
        });
        expect(toJSON()).toMatchSnapshot();
    });

});
