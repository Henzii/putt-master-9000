import React from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import Settings from '../screens/Settings';
import { Provider } from 'react-native-paper';
import Wrapper from './mocks/ApolloMockWrapper';

const wrappedSettings = () => (
    <Provider>
       <Wrapper>
            <Settings />
        </Wrapper>
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

describe('<Settings /> testit', () => {
    it('Renderöityy oikein', () => {
        const { toJSON } = render(wrappedSettings());
        expect(toJSON()).toMatchSnapshot();
    });
    it('Kaveripyyntöjen blokkaus', async () => {
        const { getByTestId } = render(wrappedSettings());
        const kytkin = getByTestId('blockFriendRequestsSwitch');
        expect(kytkin.props.value).toBeFalsy();

        act(() => fireEvent.press(kytkin));

        await waitFor(() => expect(kytkin.props.value).toBeTruthy());
    });
});
